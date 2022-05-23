exports.command = "test";

exports.describe = "run unit tests";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  if (argv.cwd) {
    process.env.INIT_CWD = require('path').resolve(argv.cwd)
  } else if (!process.env.INIT_CWD) {
    process.env.INIT_CWD = process.cwd();
  }

  cleanupHooks.push(() => process.exit(process.exitCode || 0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

  const { run } = require("../helpers/jest.js");
  await run();
};