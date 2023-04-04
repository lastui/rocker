exports.config = {
  parser: "babel",
  bracketSameLine: true,
  quoteProps: "as-needed",
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  arrowParens: "always",
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: "all",
};

exports.createEngine = async function (options) {
  const prettier = require("prettier");

  async function processFile(info) {
    if (!/\.[t|j]sx?$/.test(info.filepath)) {
      return;
    }

    if (info.data.includes("@linaria")) {
      return;
    }

    let start = null;
    let end = null;

    try {
      if (options.fix) {
        start = process.hrtime();
        const formatted = await prettier.format(info.data, exports.config);
        end = process.hrtime(start);
        if (formatted !== info.data) {
          info.changed = true;
          info.data = formatted;
        }
      } else {
        start = process.hrtime();
        info.changed = info.changed || !(await prettier.check(info.data, exports.config));
        end = process.hrtime(start);
      }
    } catch (error) {
      info.errors.push({ message: error });
    }

    if (end) {
      info.trace.push({
        name: "prettier",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.trace.push({
        name: "prettier",
        duration: 0,
      });
    }
  }

  return processFile;
};
