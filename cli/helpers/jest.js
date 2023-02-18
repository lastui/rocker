const path = require("path");
const jest = require("jest");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  await jest.run([
    "--colors",
    "--passWithNoTests",
    "--injectGlobals",
    "--testLocationInResults",
    ...(options.debug
      ? ["--runInBand", "--detectOpenHandles", "--detectLeaks", "--logHeapUsage"]
      : ["--maxWorkers=50%", "--maxConcurency=10"]),
    "--config",
    path.resolve(__dirname, "..", "..", "jest", "index.js"),
    ...(options._.length > 0 ? [options._[options._.length - 1]] : []),
  ]);
};