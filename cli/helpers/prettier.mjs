import prettier from "prettier";
import process from "node:process";

export const config = {
  parser: "babel",
  bracketSameLine: true,
  quoteProps: "as-needed",
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  arrowParens: "always",
  printWidth: 130,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: "all",
};

export async function createStream(options) {
  if (options.debug) {
    const colors = (await import('ansi-colors')).default;
    console.log(colors.dim('Prettier Configuration'));
    console.log(JSON.stringify(config, null, config.tabWidth));
    console.log();
  }

  async function processFile(info) {
    if (!/\.m?[t|j]sx?$/.test(info.filePath)) {
      return;
    }

    if (info.data.includes("@linaria")) {
      return;
    }

    let start = null;
    let end = null;

    try {
      start = process.hrtime();
      if (options.fix) {
        const formatted = await prettier.format(info.data, config);
        if (formatted !== info.data) {
          info.changed = true;
          info.data = formatted;
        }
      } else if (!info.changed) {
        info.changed = !(await prettier.check(info.data, config));
      }
      end = process.hrtime(start);
    } catch (error) {
      info.issues.push({
        engineId: "prettier",
        message: error,
        severity: 3,
      });
    }

    if (end) {
      info.timing.push({
        engineId: "prettier",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.timing.push({
        engineId: "prettier",
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
