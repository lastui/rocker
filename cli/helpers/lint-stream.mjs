import process from "node:process";
import path from "node:path";
import { Readable } from "node:stream";
import colors from "ansi-colors";
import glob from "glob";
import { ensureDirectory, writeFile, readFile } from "./io.mjs";
import { createEngine as createEnginePrettierPackageJson } from "./prettier-package-json.mjs";
import { createEngine as createEngineEslint } from "./eslint.mjs";
import { createEngine as createEngineStylelint } from "./stylelint.mjs";
import { createEngine as createEnginePrettier } from "./prettier.mjs";

export async function run(options) {
  const fileStream = new Readable({ objectMode: true });
  fileStream._read = () => {};

  if (options._.length) {
    const pattern = new RegExp(".+[.](js|jsx|ts|tsx|mjs|json|scss|css)$");
    for (const file of options._) {
      pattern.lastIndex = 0;
      if (pattern.test(file)) {
        fileStream.push(file);
      }
    }
    fileStream.push(null);
  } else {
    glob(
      "**/*.+(js|jsx|ts|tsx|mjs|json|scss|css)",
      {
        cwd: process.env.INIT_CWD,
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
      },
      (error, files) => {
        if (error) {
          fileStream.emit("error", error);
          return;
        }
        files.forEach((file) => {
          fileStream.push(file);
        });
        fileStream.push(null);
      },
    );
  }

  const engines = await Promise.all([
    createEnginePrettierPackageJson(options),
    createEngineStylelint(options),
    createEngineEslint(options),
    createEnginePrettier(options),
  ]);

  async function processFile(filePath) {
    let data = await readFile(path.join(process.env.INIT_CWD, filePath));

    const info = {
      filePath,
      data,
      issues: [],
      timing: [],
      changed: false,
    };

    for (const engine of engines) {
      await engine(info);
    }

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

    return info;
  }

  let numberTotal = 0;
  let numberFixed = 0;

  if (options.fix) {
    for await (const filePath of fileStream) {
      const { issues, changed, data, timing } = await processFile(filePath);
      if (timing.length > 0) {
        numberTotal++;
      }
      if (changed > 0) {
        numberFixed++;
      }
      if (changed) {
        await writeFile(path.join(process.env.INIT_CWD, filePath), data);
      }
    }
  } else {
    const formattedResults = [];

    for await (const filePath of fileStream) {
      const { timing, issues } = await processFile(filePath);

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
            filePath: filePath,
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

        formattedResults.push(chunk);
      }
    }

    await writeFile(
      path.resolve(process.env.INIT_CWD, "reports", "lint-final.json"),
      JSON.stringify({ issues: formattedResults }, null, 2),
    );
  }

  if (!options.quiet) {
    if (options.fix && numberFixed > 0) {
      console.log(colors.bold(`Checked ${numberTotal} files of those ${numberFixed} automatically fixed`));
    } else {
      console.log(colors.bold(`Checked ${numberTotal} files`));
    }
  }
}
