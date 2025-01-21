import process from "node:process";
import stylelint from "stylelint";
import prettier from "prettier";
import customSyntax from '@linaria/postcss-linaria';

import { config as prettierConfig } from "./prettier.mjs"

export const config = {
  extends: ['stylelint-config-standard'],
  customSyntax,
  rules: {
    'property-no-vendor-prefix': true,
    'string-no-newline': true,
    'value-no-vendor-prefix': true,
    'no-empty-source': null,
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
        ignoreComments: [/pcss-lin/],
      },
    ],
    'no-invalid-double-slash-comments': true,
    'declaration-empty-line-before': null,
    'selector-pseudo-class-no-unknown': {
      ignorePseudoClasses: [':global'],
    },
    'selector-class-pattern': null,
  },
};

export async function createEngine(options) {

  if (options.debug) {
    const colors = (await import('ansi-colors')).default;
    console.log(colors.dim('Stylelint Configuration'));
    console.log(JSON.stringify(config, null, prettierConfig.tabWidth));
    console.log();
  }

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
          results = stylelintResults[0];
          const output = stylelintResults[0]._postcssResult.css;
          if (output !== data) {
            return output
          }
          return undefined;
        },
      });

      if (result.report) {
        data = isCssInJs
          ? await prettier.format(result.report, prettierConfig)
          : result.report;
      } else if (isCssInJs) {
        data = await prettier.format(info.data, prettierConfig);
      }

      end = process.hrtime(start);

      if (options.fix && data !== info.data) {
        info.changed = true;
        info.data = data;
      }

      info.issues.push(
        ...results.parseErrors.map((item) => {
          const chunk = Object.assign({
            engineId: "stylelint",
            message: item.text,
            ruleId: item.rule,
          }, item);

          delete chunk.column;
          delete chunk.endLine;
          delete chunk.endColumn;

          chunk.severity = 2;

          return chunk;
        }),
      );
      info.issues.push(
        ...results.warnings.map((item) => {
          const chunk = Object.assign({
            engineId: "stylelint",
            message: item.text,
            ruleId: item.rule,
          }, item);

          delete chunk.column;
          delete chunk.endLine;
          delete chunk.endColumn;

          chunk.severity = 1;

          return chunk;
        }),
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

  return async function* pipe(source) {
    for await (const info of source) {
      await processFile(info);
      yield info;
    }
  };
};
