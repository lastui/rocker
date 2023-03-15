const fs = require("fs");
const path = require("path");
const eslint = require("eslint");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const babelOptions = require("../../babel").env.development;

  const cwd = options.cwd ? path.relative(process.env.PWD, process.env.INIT_CWD).replaceAll(`.${path.sep}`, "") : "";

  const engine = new eslint.ESLint({
    allowInlineConfig: true,
    useEslintrc: false,
    fix: options.fix,
    baseConfig: {
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
        babelOptions,
      },
      rules: {
        "no-debugger": "error",
        eqeqeq: "error",
      },
    },
  });

  const results = await engine.lintFiles(
    fs.existsSync(path.resolve(cwd, "src"))
      ? [path.join(cwd, "src", "**", "*.{js,ts,jsx,tsx}")]
      : [path.join(cwd, "**", "*.{js,ts,jsx,tsx}")],
  );

  if (options.fix) {
    await eslint.ESLint.outputFixes(results);
  }

  const formatter = await engine.loadFormatter("stylish");
  const output = await formatter.format(results);

  if (output) {
    console.log(output);
  } else if (options.debug) {
    console.log("All matched files use ESlint code style!");
  }

  for (const result of results) {
    if (result.errorCount > 0) {
      process.exitCode = 1;
      return;
    }
  }
};
