import process from "node:process";
import stylelint from "stylelint";
import prettier from "prettier";

import { config as prettierConfig } from "./prettier.mjs"

export const config = {
  extends: ["@linaria/stylelint-config-standard-linaria"],
  rules: {
    'value-list-comma-newline-after': null,
    'declaration-empty-line-before': null,
    'selector-pseudo-class-no-unknown': {
      ignorePseudoClasses: [':global'],
    },
  },
};

export async function createEngine(options) {

  async function processFile(info) {
    if (info.filePath.endsWith(".json")) {
      return;
    }

    const isCssInJs = /\.[t|j]sx?$/.test(info.filePath);

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
      const result = await stylelint.lint({
        config: config,
        fix: options.fix,
        code: data,
        formatter: (stylelintResults) => {
          results = stylelintResults;
        },
      });

      if (result.output) {
        data = isCssInJs
          ? await prettier.format(result.output, prettierConfig)
          : result.output;
      }

      end = process.hrtime(start);

      if (options.fix && data !== info.data) {
        info.changed = true;
        info.data = data;
      }

      info.issues.push(
        ...results[0].parseErrors.map((item) => ({
          engineId: "stylelint",
          message: item.text,
          ruleId: item.rule,
          ...item,
          severity: 2,
        })),
      );
      info.issues.push(
        ...results[0].warnings.map((item) => ({
          engineId: "stylelint",
          message: item.text,
          ruleId: item.rule,
          ...item,
          severity: 1,
        })),
      );
    } catch (error) {
      info.issues.push({
        engineId: "stylelint",
        message: error,
        severity: 3,
      });
    }

    if (end) {
      info.timing.push({
        engineId: "stylelint",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.timing.push({
        engineId: "stylelint",
        duration: 0,
      });
    }
  }

  return processFile;
};
