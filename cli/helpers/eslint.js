exports.run = async function (prefix) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const path = require("path");
  const fs = require("fs");
  const eslint = require("eslint");
  const babelOptions = require("../../babel").env.production;

  const cwd = (prefix ? `${prefix.replaceAll('./', '')}/` : '');

  const engine = new eslint.ESLint({
    allowInlineConfig: true,
    useEslintrc: false,
    fix: true,
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
        "eol-last": ["error", "never"],
        "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      },
    },
  });

  const results = await engine.lintFiles(
    fs.existsSync(path.resolve(process.env.INIT_CWD, "src")) ? [`${cwd}src/**/*.{js,ts,jsx,tsx}`] : [`${cwd}**/*.{js,ts,jsx,tsx}`],
  );

  await eslint.ESLint.outputFixes(results);

  const formatter = await engine.loadFormatter("stylish");
  const output = await formatter.format(results);

  if (output) {
    console.log(output);
  }

  for (const result of results) {
    if (result.errorCount > 0) {
      process.exitCode = 1;
      return;
    }
  }
};