exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  cleanupHooks.push(() => process.exit(process.exitCode || 0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

  const { run: prettierRun } = require("../helpers/prettier.js");
  const { run: eslintRun } = require("../helpers/eslint.js");

  await prettierRun();
  await eslintRun();
};
