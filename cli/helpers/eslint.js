const { directoryExists } = require("./io");
const path = require("path");

exports.run = async function (options) {
  process.on("unhandledRejection", reason => {
    throw reason;
  });

  const eslint = require("eslint");

  const cwd = options.cwd ? path.relative(process.env.PWD, process.env.INIT_CWD).replaceAll(`.${path.sep}`, "") : "";

  const config = {
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
      eqeqeq: "error",
    },
    plugins: options.debug ? ["log"] : [],
  };

  const engine = new eslint.ESLint({
    cwd: process.env.INIT_CWD,
    allowInlineConfig: true,
    useEslintrc: false,
    fix: options.fix,
    baseConfig: config,
  });

  const files = (await directoryExists(path.resolve(process.env.INIT_CWD, "src")))
    ? [path.join(cwd, "src", "**", "*.{js,ts,jsx,tsx}")]
    : [path.join(cwd, "**", "*.{js,ts,jsx,tsx}")];

  const results = await engine.lintFiles(files);

  if (options.fix) {
    await eslint.ESLint.outputFixes(results);
  }

  const formatter = await engine.loadFormatter("stylish");
  const output = await formatter.format(results);

  for (const result of results) {
    if (result.errorCount > 0) {
      if (output) {
        console.log(output);
      }
      process.exitCode = 1;
      return;
    }
  }

  if (!options.quiet && output) {
    console.log(output);
  }

  if (!options.quiet && !output && !options.fix && !process.exitCode) {
    console.log("All matched files use ESlint code style!");
  }
};
