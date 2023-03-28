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
    try {
      const data = await readFile(filepath);
      if (options.fix) {
        durations[filepath] = process.hrtime();
        const formatted = prettier.format(data, params);
        const end = process.hrtime(durations[filepath]);
        const duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;
        await writeFile(filepath, formatted);
        return { filepath, duration, error: null, changed: false };
      } else {
        durations[filepath] = process.hrtime();
        const formatted = prettier.check(data, params);
        const end = process.hrtime(durations[filepath]);
        const duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;
        return {
          filepath,
          duration,
          error: null,
          changed: !formatted,
        };
      }
    } catch (error) {
      return { filepath, duration: "? ms", error, changed: false };
    }
  }

  const results = await Promise.all(files.map(processFile));

  for (const { filepath, error, changed, duration } of results) {
    if (error) {
      process.exitCode = 1;
      console.log(colors.red("✖"), colors.dim(`${filepath} ${error}`));
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
