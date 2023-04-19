import process from "node:process";
import path from "node:path";
import colors from "ansi-colors";
import { execShellCommand } from "./shell.mjs"
import { fileExists, directoryExists } from "./io.mjs";

function isLikelyASyntaxError(message) {
  return message.indexOf("Syntax error:") !== -1;
}

function formatMessage(message) {
  let lines = [];

  if (typeof message === "string") {
    lines = message.split("\n");
  } else if ("message" in message) {
    lines = message["message"].split("\n");
  } else if (Array.isArray(message)) {
    message.forEach((message) => {
      if ("message" in message) {
        lines = message["message"].split("\n");
      }
    });
  }
  lines = lines.filter((line) => !/Module [A-z ]+\(from/.test(line));
  lines = lines.map((line) => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `Syntax error: ${errorMessage} (${errorLine}:${errorColumn})`;
  });
  message = lines.join("\n");
  message = message.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, `Syntax error: $3 ($1:$2)\n`);
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`,
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`,
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`,
  );
  lines = message.split("\n");
  if (lines.length > 2 && lines[1].trim() === "") {
    lines.splice(1, 1);
  }
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, "$1");
  if (lines[1] && lines[1].indexOf("Module not found: ") === 0) {
    lines = [
      lines[0],
      lines[1].replace("Error: ", "").replace("Module not found: Cannot find file:", "Cannot find file:"),
    ];
  }
  if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
    lines[1] = "To import Sass files, you first need to install sass.\n";
    lines[1] += "Run `npm install sass` or `yarn add sass` inside your workspace.";
  }

  message = lines.join("\n");
  message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, "");
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, "");
  lines = message.split("\n");
  lines = lines.filter(
    (line, index, arr) => index === 0 || line.trim() !== "" || line.trim() !== arr[index - 1].trim(),
  );
  message = lines.join("\n");
  return message.trim();
}

function formatWebpackMessages(stats) {
  const formattedErrors = (stats.compilation.errors ?? []).map(formatMessage);
  const formattedWarnings = (stats.compilation.warnings ?? []).map(formatMessage);
  const result = { errors: formattedErrors, warnings: formattedWarnings };
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

async function propagateProgressOption() {
  try {
    const progress = await execShellCommand("npm config get progress");
    if (progress === "false") {
      process.env.PROGRESS = "false";
      return;
    }
  } catch (err) {}
  try {
    const progress = await execShellCommand("yarn config get progress");
    if (progress === "false") {
      process.env.PROGRESS = "false";
      return;
    }
  } catch (err) {}
}

export async function getStack(options, packageName) {
  if (options.debug) {
    const oldDebug = (process.env.DEBUG || "").split(",");
    process.env.DEBUG = ["rocker:*", ...oldDebug].join(",");
  }

  const projectConfig = path.resolve(process.env.INIT_CWD, "webpack.config.js");
  const customConfigExists = await fileExists(projectConfig);

  const projectNodeModules = path.resolve(process.env.INIT_CWD, "node_modules");
  const projectNodeModulesExists = await directoryExists(`${projectNodeModules}/webpack`);

  let config = null;
  let webpack = null;
  let DevServer = null;

  if (customConfigExists) {
    config = (await import(projectConfig)).default;
    config.resolve.modules = [];
    const nodeModules = new Set();
    for (const entrypoint in config.entry) {
      const patchedSources = [];
      const originalSources = Array.isArray(config.entry[entrypoint])
        ? config.entry[entrypoint]
        : [config.entry[entrypoint]];
      for (const source of originalSources) {
        if (source.startsWith(".")) {
          patchedSources.push(path.resolve(process.env.INIT_CWD, source));
        } else {
          patchedSources.push(source);
        }
      }
      for (const source of patchedSources) {
        const candidates = [
          path.resolve(config.context, "node_modules"),
          path.resolve(source, "..", "node_modules"),
          path.resolve(source, "..", "..", "node_modules"),
        ];

        for (const nodeModulesCandidate of candidates) {
          if (await directoryExists(nodeModulesCandidate)) {
            nodeModules.add(nodeModulesCandidate);
          }
        }
      }
      config.entry[entrypoint] = patchedSources;
    }

    if (nodeModules.size > 0) {
      config.snapshot.managedPaths = Array.from(nodeModules);
      config.resolve.modules.push(...nodeModules);
    } else {
      config.resolve.modules.push("node_modules");
    }
  } else if (projectNodeModulesExists) {
    config = (await import(`${projectNodeModules}/@lastui/rocker/webpack/config/${packageName === "spa" ? "spa" : "module"}/index.js`)).default;
    config.entry = {};
    const indexFile = path.resolve(process.env.INIT_CWD, "src", "index.js");
    const indexExists = await fileExists(indexFile);
    if (indexExists) {
      config.entry[packageName === "spa" ? "main" : packageName] = [indexFile];
    }
  } else {
    config = (await import(`@lastui/rocker/webpack/config/${packageName === "spa" ? "spa" : "module"}/index.js`)).default;
    config.entry = {};
    const indexFile = path.resolve(process.env.INIT_CWD, "src", "index.js");
    const indexExists = await fileExists(indexFile);
    if (indexExists) {
      config.entry[packageName === "spa" ? "main" : packageName] = [indexFile];
    }
  }

  if (!config.infrastructureLogging) {
    config.infrastructureLogging = {
      appendOnly: options.debug,
      level: options.debug ? "verbose" : "info",
      colors: process.stdout.isTTY,
    };
  }
  config.infrastructureLogging.stream = process.stdout;

  if (options.debug) {
    config.stats.all = true;
  }
  if (projectNodeModulesExists) {
    webpack = (await import(`${projectNodeModules}/webpack/lib/index.js`)).default;
    DevServer = (await import(`${projectNodeModules}/webpack-dev-server/lib/Server.js`)).default;
  } else {
    webpack = (await import("webpack")).default;
    DevServer = (await import("webpack-dev-server")).default;
  }

  return {
    config,
    webpack,
    DevServer,
  };
};

export async function setup(options, packageName) {
  process.env.NODE_ENV = options.development ? "development" : "production";
  process.env.BABEL_ENV = process.env.NODE_ENV;

  if (options.quiet) {
    process.env.PROGRESS === "false";
  } else {
    await propagateProgressOption();
  }

  if (!options.quiet) {
    console.log(colors.bold(`Compiling ${packageName}...`));
  }

  return function (err, stats) {
    process.exitCode = 0;
    if (err) {
      console.log(colors.red("Failed to compile.\n"));
      console.log(err);
      process.exitCode = 1;
      return;
    }
    if (!stats) {
      return;
    }
    const messages = formatWebpackMessages(stats);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful && !options.quiet) {
      console.log(colors.bold("Compiled successfully!"));
    }
    if (messages.errors.length) {
      process.exitCode = 1;
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(colors.red("Failed to compile.\n"));
      for (const error of messages.errors) {
        console.log(colors.red(error));
      }
      return;
    }
    if (messages.warnings.length) {
      console.log(colors.bold(colors.yellow("Compiled with warnings.\n")));
      for (const error of messages.warnings) {
        console.log(colors.yellow(error));
      }
    }
  };
};