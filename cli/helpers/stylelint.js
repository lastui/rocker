exports.createEngine = async function (options) {
  const stylelint = require("stylelint");

  const params = {
    extends: ["@linaria/stylelint-config-standard-linaria"],
  };

  async function processFile(info) {
    if (info.filepath.endsWith(".json")) {
      return;
    }

    let start = null;
    let end = null;

    try {
      start = process.hrtime();
      let results = null;
      await stylelint.lint({
        config: params,
        fix: options.fix,
        code: info.data,
        formatter: (stylelintResults) => {
          results = stylelintResults;
        },
      });

      end = process.hrtime(start);
      if (options.fix && results[0]._postcssResult.css !== info.data) {
        info.changed = true;
        info.data = results[0]._postcssResult.css;
      }
      info.errors.push(...results[0].parseErrors);
      info.warnings.push(...results[0].warnings);
      info.changed =
        info.changed ||
        results[0].warnings.length !== 0 ||
        results[0].parseErrors.length !== 0 ||
        results[0]._postcssResult.css !== info.data;
    } catch (error) {
      info.errors.push(error);
    }

    if (end) {
      info.trace.push({
        name: "stylelint",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.trace.push({
        name: "stylelint",
        duration: 0,
      });
    }
  }

  return processFile;
};
