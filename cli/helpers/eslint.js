const { glob, readFile, writeFile } = require("./io");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");
  const eslint = require("eslint");

  const params = {
    env: {
      es6: true,
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
      sourceType: "module",
      allowImportExportEverywhere: false,
      ecmaFeatures: {
        globalReturn: false,
      },
      requireConfigFile: false,
      babelOptions: require("../../babel").env.development,
    },
    rules: {
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
    },
  };

  const engine = new eslint.ESLint({
    cwd: process.env.INIT_CWD,
    allowInlineConfig: true,
    useEslintrc: false,
    fix: options.fix,
    baseConfig: params,
  });

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
      start = process.hrtime();
      const results = await engine.lintText(data, { filePath: filepath });
      end = process.hrtime(start);
      if (options.fix && results[0].output) {
        await writeFile(filepath, results[0].output);
      }
      info.errors.push(...results[0].messages.filter((item) => item.severity > 1));
      info.warnings.push(...results[0].messages.filter((item) => item.severity <= 1));
      info.changed = results[0].messages.length !== 0 || Boolean(results[0].output);
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

  const stream = glob("**/*.+(js|jsx|ts|tsx)", {
    cwd: process.env.INIT_CWD,
    ignore: ["**/*node_modules/**", "**/*build/**", "**/*dist/**", "**/*.min.js", "**/*lcov-report/**", "**/*.dll.js"],
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
        console.log(
          colors.red("✖"),
          colors.red(`${filepath} ${item.line}:${item.column}`),
          colors.bold.red(item.message),
          colors.dim(`(${duration})`),
        );
      }
      continue;
    }
    if (!options.quiet && warnings.length > 0) {
      for (const item of warnings) {
        console.log(
          colors.yellow("!"),
          colors.yellow(`${filepath} ${item.line}:${item.column}`),
          colors.bold.yellow(item.message),
          colors.dim(`(${duration})`),
        );
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
