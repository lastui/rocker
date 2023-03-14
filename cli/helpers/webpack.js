const path = require("path");
const colors = require("ansi-colors");
const { execShellCommand } = require("./shell.js");
const { fileExists, directoryExists } = require("./io.js");

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

exports.getStack = async function (options, packageName) {
  const projectConfig = path.resolve(process.env.INIT_CWD, "webpack.config.js");
  const customConfigExists = await fileExists(projectConfig);

  const projectNodeModules = path.resolve(process.env.INIT_CWD, "node_modules");
  const projectNodeModulesExists = await directoryExists(`${projectNodeModules}/webpack`);

  let config = null;
  let webpack = null;
  let DevServer = null;

  if (customConfigExists) {
    config = require(projectConfig);
    const nodeModules = [];
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
        const nodeModulesCandidate = path.resolve(source, "..", "..", "node_modules");
        if (await directoryExists(nodeModulesCandidate)) {
          nodeModules.push(nodeModulesCandidate);
        }
      }
      config.entry[entrypoint] = patchedSources;
    }
    config.resolve.modules.push(...nodeModules);
    config.snapshot.managedPaths.push(...nodeModules);
  } else if (projectNodeModulesExists) {
    config = require(`${projectNodeModules}/@lastui/rocker/webpack/config/${packageName === "spa" ? "spa" : "module"}`);
    config.entry = {};
    const indexFile = path.resolve(process.env.INIT_CWD, "src", "index.js");
    const indexExists = await fileExists(indexFile);
    if (indexExists) {
      config.entry[packageName === "spa" ? "main" : packageName] = [indexFile];
    }
  } else {
    config = require(`@lastui/rocker/webpack/config/${packageName === "spa" ? "spa" : "module"}`);
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

  if (projectNodeModulesExists) {
    webpack = require(`${projectNodeModules}/webpack`);
    DevServer = require(`${projectNodeModules}/webpack-dev-server`);
  } else {
    webpack = require("webpack");
    DevServer = require("webpack-dev-server");
  }

  return {
    config,
    webpack,
    DevServer,
  };
};

exports.setup = async function (options, packageName) {
  process.env.NODE_ENV = options.development ? "development" : "production";

  process.env.BABEL_ENV = process.env.NODE_ENV;

  if (options.quiet) {
    process.env.PROGRESS === "false";
  } else {
    await propagateProgressOption();
  }

  if (options.debug) {
    if (process.env.DEBUG) {
      process.env.DEBUG = ["babel:*", ...process.env.DEBUG.split(",")].join(",");
    } else {
      process.env.DEBUG = "babel:*";
    }
  }

  console.log(colors.bold(`Compiling ${packageName}...`));

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
    if (isSuccessful) {
      console.log(colors.bold("Compiled successfully!"));
    }
    if (messages.errors.length) {
      process.exitCode = 1;
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(colors.red("Failed to compile.\n"));
      console.log(colors.red(messages.errors.join("\n\n")));
      return;
    }
    if (messages.warnings.length) {
      console.log(colors.bold(colors.yellow("Compiled with warnings.\n")));
      console.log(colors.yellow(messages.warnings.join("\n\n")));
    }
  };
};
