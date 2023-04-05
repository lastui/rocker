const { config: prettierConfig } = require("./prettier");

exports.config = {
  tabWidth: prettierConfig.tabWidth,
  useTabs: Boolean(prettierConfig.useTabs),
};

exports.createEngine = async function (options) {
  const prettier = require("prettier-package-json");

  async function processFile(info) {
    if (!info.filePath.endsWith("package.json")) {
      return;
    }

    let start = null;
    let end = null;

    try {
      if (options.fix) {
        start = process.hrtime();
        const formatted = await prettier.format(JSON.parse(info.data), exports.config);
        end = process.hrtime(start);
        if (formatted !== info.data) {
          info.changed = true;
          info.data = formatted;
        }
      } else {
        start = process.hrtime();
        info.changed = info.changed || !(await prettier.check(JSON.parse(info.data), exports.config));
        end = process.hrtime(start);
      }
    } catch (error) {
      info.issues.push({
        engineId: "prettier-package-json",
        message: error,
        severity: 3,
      });
    }

    if (end) {
      info.timing.push({
        engineId: "prettier-package-json",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.timing.push({
        engineId: "prettier-package-json",
        duration: 0,
      });
    }
  }

  return processFile;
};
