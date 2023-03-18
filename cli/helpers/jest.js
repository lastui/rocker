const path = require("path");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const jest = require("jest");

  const config = path.resolve(__dirname, "..", "..", "jest", "index.js");

  await jest.run([
    ...(process.stdout.isTTY ? ["--colors"] : []),
    "--passWithNoTests",
    "--injectGlobals",
    "--testLocationInResults",
    `--config=${config}`,
    ...(options.development ? ["--watchAll", "--coverage=false"] : []),
    ...(options.debug
      ? [
          "--debug",
          "--errorOnDeprecated",
          "--verbose",
          "--runInBand",
          "--detectOpenHandles",
          "--detectLeaks",
          "--logHeapUsage",
          "--bail",
        ]
      : ["--maxWorkers=50%", "--maxConcurency=10"]),
    ...options._,
  ]);
};
