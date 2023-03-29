const { glob, writeFile, readFile } = require("./io");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");
  const prettier = require("prettier");

  const files = await glob("**/*.+(js|jsx|ts|tsx)", {
    cwd: process.env.INIT_CWD,
    ignore: ["**/*node_modules/**", "**/*.min.js", "**/*lcov-report/**", "**/*.dll.js"],
  });

  const params = {
    parser: "babel",
    bracketSameLine: true,
    quoteProps: "as-needed",
    embeddedLanguageFormatting: "auto",
    endOfLine: "lf",
    arrowParens: "always",
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    trailingComma: "all",
  };

  const durations = {};

  async function processFile(filepath) {
    const info = {
      filepath,
      error: null,
      changed: false,
    };

    durations[filepath] = process.hrtime();

    try {
      const data = await readFile(filepath);

      if (options.fix) {
        const formatted = await prettier.format(data, params);
        if (formatted !== data) {
          info.changed = true;
          await writeFile(filepath, formatted);
        }
      } else {
        info.changed = !(await prettier.check(data, params));
      }
    } catch (error) {
      info.error = error;
    }

    const end = process.hrtime(durations[filepath]);
    info.duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;

    return info;
  }

  const results = await Promise.all(files.map(processFile));

  for (const { filepath, error, changed, duration } of results) {
    if (error) {
      process.exitCode = 1;
      console.log(colors.red("✖"), colors.red(filepath), colors.bold.red(error), colors.dim(`(${duration})`));
      continue;
    }
    if (!changed && options.debug) {
      console.log(colors.green(`✓`), colors.dim(`${filepath} (${duration})`));
    }
    if (changed && !options.quiet) {
      console.log(colors.yellow("!"), colors.dim(`${filepath} (${duration})`));
    }
  }
};
