const { writeFile, readFile } = require("./io");
const glob = require("glob");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const colors = require("ansi-colors");
  const prettier = require("prettier");

  const files = await new Promise((resolve, reject) => {
    glob(
      "**/*.+(js|jsx|ts|tsx)",
      {
        cwd: process.env.INIT_CWD,
        ignore: ["**/*node_modules/**", "**/*.min.js", "**/*lcov-report/**", "**/*.dll.js"],
      },
      (error, files) => {
        if (error) {
          return reject(error);
        }
        return resolve(files);
      },
    );
  });

  const params = {
    parser: "babel",
    bracketSameLine: true,
    quoteProps: "as-needed",
    embeddedLanguageFormatting: "auto",
    endOfLine: "lf",
    arrowParens: "always",
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    trailingComma: "all",
  };

  async function processFile(filepath) {
    try {
      const data = await readFile(filepath);
      if (options.fix) {
        const formatted = prettier.format(data, params);
        await writeFile(filepath, formatted);
        return { filepath, error: null, changed: false };
      } else {
        const formatted = prettier.check(data, params);
        return {
          filepath,
          error: null,
          changed: !formatted,
        };
      }
    } catch (error) {
      return { filepath, error, changed: false };
    }
  }

  const results = await Promise.all(files.map(processFile));

  for (const { filepath, error, changed } of results) {
    if (error) {
      process.exitCode = 1;
      console.log(colors.red("✖"), colors.dim(`${filepath} ${error}`));
      continue;
    }
    if (!changed && options.debug) {
      console.log(colors.green(`✓`), colors.dim(filepath));
    }
    if (changed && !options.quiet) {
      console.log(colors.yellow("!"), colors.dim(filepath));
    }
  }
};
