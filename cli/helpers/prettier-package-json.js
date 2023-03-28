const { glob, writeFile, readFile } = require("./io");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");
  const prettier = require("prettier-package-json");

  const files = await glob("**/*package.json", {
    cwd: process.env.INIT_CWD,
    ignore: ["**/*node_modules/**"],
  });

  const params = {
    tabWidth: 2,
    useTabs: false,
  };

  const durations = {};

  async function processFile(filepath) {
    try {
      const data = await readFile(filepath);
      const json = JSON.parse(data);

      durations[filepath] = process.hrtime();
      const formatted = prettier.format(json, params);
      const end = process.hrtime(durations[filepath]);
      const duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;

      if (options.fix) {
        await writeFile(filepath, formatted);
        return { filepath, duration, error: null, changed: false };
      } else {
        const formatted = prettier.check(json, params);
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
