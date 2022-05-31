const path = require("path");
const jest = require("jest");

exports.run = async function (debug) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  await jest.run([
    "--colors",
    "--passWithNoTests",
    "--injectGlobals",
    "--testLocationInResults",
    ...(debug
      ? ["--runInBand", "--detectOpenHandles", "--detectLeaks", "--logHeapUsage"]
      : ["--maxWorkers=50%", "--maxConcurency=10"]),
    "--config",
    path.resolve(__dirname, "../../jest/index.js"),
  ]);
};