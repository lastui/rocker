exports.createEngine = async function (options) {
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

  async function processFile(info) {
    if (!/\.[t|j]sx?$/.test(info.filepath)) {
      return;
    }

    let start = null;
    let end = null;

    try {
      start = process.hrtime();
      const results = await engine.lintText(info.data, { filePath: info.filepath });
      end = process.hrtime(start);
      if (options.fix && results[0].output) {
        info.changed = true;
        info.data = results[0].output;
      }
      info.errors.push(...results[0].messages.filter((item) => item.severity > 1));
      info.warnings.push(...results[0].messages.filter((item) => item.severity <= 1));
      info.changed = info.changed || results[0].messages.length !== 0 || Boolean(results[0].output);
    } catch (error) {
      info.errors.push(error);
    }

    if (end) {
      info.trace.push({
        name: "eslint",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.trace.push({
        name: "eslint",
        duration: 0,
      });
    }
  }

  return processFile;
};
