const path = require("path");
const jest = require("jest");

exports.run = async function () {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  await jest.run([
    "--colors",
    "--passWithNoTests",
    "--injectGlobals",
    `--maxWorkers=50%`,
    "--config",
    path.resolve(__dirname, "../../jest/index.js"),
  ]);
};