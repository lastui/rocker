const { glob, writeFile, readFile } = require("./io");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");
  const prettier = require("prettier-package-json");

  const params = {
    tabWidth: 2,
    useTabs: false,
  };

  async function processFile(filepath) {
    const info = {
      filepath,
      errors: [],
      warnings: [],
      changed: false,
    };

    let start = null;
    let end = null;

    try {
      const data = await readFile(filepath);
      if (options.fix) {
        start = process.hrtime();
        const formatted = await prettier.format(JSON.parse(data), params);
        end = process.hrtime(start);
        if (formatted !== data) {
          info.changed = true;
          await writeFile(filepath, formatted);
        }
      } else {
        start = process.hrtime();
        info.changed = !(await prettier.check(JSON.parse(data), params));
        end = process.hrtime(start);
      }
    } catch (error) {
      info.errors.push(error);
    }

    if (end) {
      info.duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;
    } else {
      info.duration = "?? ms";
    }

    return info;
  }

  const stream = glob("**/*package.json", {
    cwd: process.env.INIT_CWD,
    ignore: ["**/*node_modules/**"],
  });

  const work = [];
  for await (const entry of stream) {
    work.push(processFile(entry));
  }

  const results = await Promise.all(work);

  for (const { filepath, errors, warnings, changed, duration } of results) {
    if (errors.length > 0) {
      process.exitCode = 1;
      for (const item of errors) {
        console.log(colors.red("✖"), colors.red(filepath), colors.bold.red(item), colors.dim(`(${duration})`));
      }
      continue;
    }
    if (!options.quiet && warnings.length > 0) {
      for (const item of warnings) {
        console.log(colors.yellow("!"), colors.yellow(filepath), colors.bold.yellow(item), colors.dim(`(${duration})`));
      }
      continue;
    }
    if (!changed && options.debug) {
      console.log(colors.green(`✓`), colors.dim(`${filepath} (${duration})`));
      continue;
    }
    if (changed && !options.quiet) {
      console.log(colors.yellow("!"), colors.dim(`${filepath} (${duration})`));
    }
  }
};
