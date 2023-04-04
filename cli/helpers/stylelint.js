const { config: prettierConfig } = require("./prettier");

exports.config = {
  extends: ["@linaria/stylelint-config-standard-linaria"],
};

exports.createEngine = async function (options) {
  const stylelint = require("stylelint");
  const prettier = require("prettier");

  async function processFile(info) {
    if (info.filepath.endsWith(".json")) {
      return;
    }

    const isCssInJs = /\.[t|j]sx?$/.test(info.filepath);

    if (isCssInJs && !info.data.includes("@linaria")) {
      return;
    }

    let start = null;
    let end = null;

    try {
      start = process.hrtime();

      let data = info.data;
      if (isCssInJs) {
        data = await prettier.format(data, {
          ...prettierConfig,
          arrowParens: "avoid",
        });
      }

      let results = null;
      await stylelint.lint({
        config: exports.config,
        fix: options.fix,
        code: data,
        formatter: (stylelintResults) => {
          results = stylelintResults;
        },
      });

      if (results[0]._postcssResult.css) {
        data = isCssInJs
          ? await prettier.format(results[0]._postcssResult.css, prettierConfig)
          : results[0]._postcssResult.css;
      }

      end = process.hrtime(start);

      if (options.fix && data !== info.data) {
        info.changed = true;
        info.data = data;
      }

      info.errors.push(...results[0].parseErrors);
      info.warnings.push(...results[0].warnings);
      info.changed =
        info.changed || results[0].warnings.length !== 0 || results[0].parseErrors.length !== 0 || data !== info.data;
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
