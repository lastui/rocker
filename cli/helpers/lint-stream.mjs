import process from "node:process";
import path from "node:path";
import { pipeline } from "node:stream/promises";

import { Readable } from "node:stream";
import colors from "ansi-colors";
import { globStream } from "glob";
import { ensureDirectory, writeFile, readFile } from "./io.mjs";
import { createStream as createStreamPrettierPackageJson } from "./prettier-package-json.mjs";
import { createStream as createStreamEslint } from "./eslint.mjs";
import { createStream as createStreamStylelint } from "./stylelint.mjs";
import { createStream as createStreamPrettier } from "./prettier.mjs";

export async function run(options) {
  const patterns = options._.length > 0 ? options._ : ["**/*.+(js|jsx|ts|tsx|mjs|json|scss|css)"];

  const validation = new RegExp(".+[.](js|jsx|ts|tsx|mjs|json|scss|css)$");

  const files = globStream(patterns, {
    cwd: process.env.INIT_CWD,
    nodir: true,
    ignore: [
      "**/*.git*/**",
      "**/*node_modules/**",
      "**/*build/**",
      "**/*reports/ut-coverage/**",
      "**/*dist/**",
      "**/*lcov-report/**",
      "**/*.min.js",
      "**/*.dll.js",
      "**/*-lock.json",
      "**/lint-final.json",
      "**/coverage-final.json",
    ],
  });

  const workflow = await Promise.all([
    createStreamPrettierPackageJson(options),
    createStreamStylelint(options),
    createStreamEslint(options),
    createStreamPrettier(options),
  ]);

  async function* filter(source) {
    for await (const filePath of source) {
      if (validation.test(filePath)) {
        yield {
          filePath,
          data: await readFile(path.join(process.env.INIT_CWD, filePath)),
          issues: [],
          timing: [],
          changed: false,
        };
      }
    }
  }

  let numberTotal = 0;
  let numberFixed = 0;

  workflow.push(async function* (source) {
    for await (const info of source) {
      if (info.timing.length > 0) {
        const duration = `(${info.timing.reduce((acc, trace) => acc + trace.duration, 0).toFixed(2)} ms)`;

        if (info.issues.length > 0) {
          for (const issue of info.issues) {
            if (issue.severity > 1) {
              process.exitCode = 1;
              console.log(
                colors.red("✖"),
                colors.red(`${info.filePath}:${issue.line ?? 1}:${issue.column ? issue.column - 1 : 0}`),
                colors.bold.red(issue.message),
                colors.dim(duration),
                colors.dim(issue.ruleId ? issue.ruleId : ""),
              );
            } else if (!options.quiet) {
              console.log(
                colors.yellow("!"),
                colors.yellow(`${info.filePath}:${issue.line ?? 1}:${issue.column ? issue.column - 1 : 0}`),
                colors.bold.yellow(issue.message),
                colors.dim(duration),
                colors.dim(issue.ruleId ? issue.ruleId : ""),
              );
            }
          }
        } else if (!info.changed && options.debug) {
          console.log(colors.green(`✓`), colors.dim(info.filePath), colors.dim(duration));
        } else if (info.changed && !options.quiet) {
          console.log(colors.yellow("!"), colors.dim(info.filePath), colors.dim(duration));
        }
      }

      yield info;
    }
  });

  if (options.fix) {
    workflow.push(async function* (source) {
      for await (const { filePath, issues, changed, data, timing } of source) {
        if (timing.length > 0) {
          numberTotal++;
        }
        if (changed) {
          numberFixed++;
          await writeFile(path.join(process.env.INIT_CWD, filePath), data);
        }
      }
    });
  } else {
    workflow.push(async function* (source) {
      for await (const { filePath, timing, issues } of source) {
        if (timing.length > 0) {
          numberTotal++;
        }

        for (const issue of issues) {
          const chunk = {
            ruleId: issue.ruleId || "formatting",
            engineId: issue.engineId,
            severity: ["INFO", "MINOR", "CRITICAL", "BLOCKER"][issue.severity],
            type: issue.severity > 1 ? "BUG" : "CODE_SMELL",
            primaryLocation: {
              message: issue.message,
              filePath,
            },
          };

          if (issue.line) {
            chunk.primaryLocation.textRange = { startLine: issue.line };
            if (issue.endLine !== undefined && issue.column !== undefined && issue.endColumn !== undefined) {
              chunk.primaryLocation.textRange.startColumn = issue.column;
              chunk.primaryLocation.textRange.endColumn = issue.endColumn;
              chunk.primaryLocation.textRange.endLine = issue.endLine;
            }
          }

          yield chunk;
        }
      }
    });

    workflow.push(async function* (source) {
      const issues = [];
      for await (const issue of source) {
        issues.push(issue);
      }
      await writeFile(path.resolve(process.env.INIT_CWD, "reports", "lint-final.json"), JSON.stringify({ issues }, null, 2));
    });
  }

  await pipeline(files, filter, ...workflow);

  if (!options.quiet) {
    if (options.fix && numberFixed > 0) {
      console.log(colors.bold(`Checked ${numberTotal} files of those ${numberFixed} automatically fixed`));
    } else {
      console.log(colors.bold(`Checked ${numberTotal} files`));
    }
  }
}
