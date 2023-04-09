import process from "node:process";
import path from "node:path";
import { Readable } from "node:stream";
import colors from "ansi-colors";
import glob from "glob"
import { ensureDirectory, writeFile, readFile } from "./io.mjs";
import { createEngine as createEnginePrettierPackageJson } from "./prettier-package-json.mjs";
import { createEngine as createEngineEslint } from "./eslint.mjs";
import { createEngine as createEngineStylelint } from "./stylelint.mjs";
import { createEngine as createEnginePrettier } from "./prettier.mjs";

export async function run(options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const fileStream = new Readable({ objectMode: true });

  glob(
    "**/*.+(js|jsx|ts|tsx|mjs|json|scss|css)",
    {
      cwd: process.env.INIT_CWD,
      ignore: [
        "**/*node_modules/**",
        "**/*build/**",
        "**/*dist/**",
        "**/*lcov-report/**",
        "**/*.min.js",
        "**/*.dll.js",
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

  fileStream._read = () => {};

  const processFilePrettierPackageJson = await createEnginePrettierPackageJson(options);
  const processFileEslint = await createEngineEslint(options);
  const processFileStylelint = await createEngineStylelint(options);
  const processFilePrettier = await createEnginePrettier(options);

  async function processFile(filePath) {
    let data = await readFile(path.join(process.env.INIT_CWD, filePath));

    const info = {
      filePath,
      data,
      issues: [],
      timing: [],
      changed: false,
    };

    await processFilePrettierPackageJson(info);
    await processFileStylelint(info);
    await processFileEslint(info);
    await processFilePrettier(info);

    if (info.timing.length > 0) {
      const duration = `(${info.timing.reduce((acc, trace) => acc + trace.duration, 0).toFixed(2)} ms)`;

      if (info.issues.length > 0) {
        for (const issue of info.issues) {
          if (issue.severity > 1) {
            process.exitCode = 1;
            console.log(
              colors.red("✖"),
              colors.red(info.filePath),
              colors.bold.red(issue.message),
              colors.dim(duration),
            );
          } else if (!options.quiet) {
            console.log(
              colors.yellow("!"),
              colors.yellow(info.filePath),
              colors.bold.yellow(issue.message),
              colors.dim(duration),
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

  const processingWork = [];

  for await (const filePath of fileStream) {
    processingWork.push(processFile(filePath));
  }

  const results = await Promise.all(processingWork);

  if (options.fix) {
    const fileUpdates = [];
    for (const { issues, changed, filePath, data } of results) {
      if (changed) {
        fileUpdates.push(writeFile(path.join(process.env.INIT_CWD, filePath), data));
      }
    }
    await Promise.all(fileUpdates);
  } else {
    const formattedResults = results.reduce((issues, item) => {
      for (const issue of item.issues) {
        issues.push({
          ruleId: issue.ruleId || "formatting",
          severity: ["INFO", "MINOR", "CRITICAL", "BLOCKER"][issue.severity],
          type: issue.severity > 1 ? "BUG" : "CODE_SMELL",
          primaryLocation: {
            message: issue.message,
            filePath: item.filePath,
            textRange: issue.line
              ? {
                  startLine: issue.line,
                  startColumn: issue.column,
                  endLine: issue.endLine,
                  endColumn: issue.endColumn,
                }
              : undefined,
          },
        });
      }
      return issues;
    }, []);

    await writeFile(
      path.resolve(process.env.INIT_CWD, "reports", "lint-final.json"),
      JSON.stringify({ issues: formattedResults }, null, 2),
    );
  }

  if (!options.quiet) {
    const numberTotal = results.reduce((acc, item) => (item.timing.length > 0 ? acc + 1 : acc), 0);
    const numberFixed = results.reduce((acc, item) => (item.changed ? acc + 1 : acc), 0);

    if (options.fix && numberFixed > 0) {
      console.log(colors.bold(`Checked ${numberTotal} files of those ${numberFixed} automatically fixed`));
    } else {
      console.log(colors.bold(`Checked ${numberTotal} files`));
    }
  }

};
