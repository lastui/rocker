const path = require("path");
const glob = require("glob");
const { Readable } = require("stream");
const { writeFile, readFile } = require("./io");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");

  const fileStream = new Readable({ objectMode: true });

  glob(
    "**/*.+(js|jsx|ts|tsx|json|scss|css)",
    {
      cwd: process.env.INIT_CWD,
      ignore: [
        "**/*node_modules/**",
        "**/*build/**",
        "**/*dist/**",
        "**/*lcov-report/**",
        "**/*coverage/**",
        "**/*.min.js",
        "**/*.dll.js",
      ],
    },
    (err, files) => {
      if (err) {
        fileStream.emit("error", err);
        return;
      }
      files.forEach((file) => {
        fileStream.push(file);
      });
      fileStream.push(null);
    },
  );

  fileStream._read = () => {};

  const { createEngine: createEnginePrettierPackageJson } = require("./prettier-package-json");
  const processFilePrettierPackageJson = await createEnginePrettierPackageJson(options);

  const { createEngine: createEngineEslint } = require("./eslint");
  const processFileEslint = await createEngineEslint(options);

  const { createEngine: createEngineStylelint } = require("./stylelint");
  const processFileStylelint = await createEngineStylelint(options);

  const { createEngine: createEnginePrettier } = require("./prettier");
  const processFilePrettier = await createEnginePrettier(options);

  async function processFile(filepath) {
    let data = await readFile(path.join(process.env.INIT_CWD, filepath));

    const info = {
      filepath,
      data,
      errors: [],
      warnings: [],
      trace: [],
      changed: false,
    };

    await processFilePrettierPackageJson(info);
    await processFileStylelint(info);
    await processFileEslint(info);
    await processFilePrettier(info);

    if (info.trace.length > 0) {
      const duration = `(${info.trace.reduce((acc, trace) => acc + trace.duration, 0).toFixed(2)} ms)`;

      if (info.errors.length > 0) {
        for (const item of info.errors) {
          console.log(colors.red("✖"), colors.red(info.filepath), colors.bold.red(item.message), colors.dim(duration));
        }
      } else if (!options.quiet && info.warnings.length > 0) {
        for (const item of info.warnings) {
          console.log(
            colors.yellow("!"),
            colors.yellow(info.filepath),
            colors.bold.yellow(item.message),
            colors.dim(duration),
          );
        }
      } else if (!info.changed && options.debug) {
        console.log(colors.green(`✓`), colors.dim(info.filepath), colors.dim(duration));
      } else if (info.changed && !options.quiet) {
        console.log(colors.yellow("!"), colors.dim(info.filepath), colors.dim(duration));
      }
    }

    return info;
  }

  const processingWork = [];

  for await (const filepath of fileStream) {
    processingWork.push(processFile(filepath));
  }

  const results = await Promise.all(processingWork);

  const fileUpdates = [];
  for (const { errors, changed, filepath, data } of results) {
    if (changed) {
      fileUpdates.push(writeFile(path.join(process.env.INIT_CWD, filepath), data));
    }
    if (errors.length > 0) {
      process.exitCode = 1;
    }
  }

  await Promise.all(fileUpdates);

  if (!options.quiet) {
    const numberTotal = results.reduce((acc, item) => (item.trace.length > 0 ? acc + 1 : acc), 0);
    const numberFixed = results.reduce((acc, item) => (item.changed ? acc + 1 : acc), 0);

    if (options.fix && numberFixed > 0) {
      console.log(colors.bold(`Checked ${numberTotal} files of those ${numberFixed} automatically fixed`));
    } else {
      console.log(colors.bold(`Checked ${numberTotal} files`));
    }
  }
};
