exports.command = "lint";

exports.describe = "lint sources";

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

  const { run: prettierRun } = require("../helpers/prettier.js");
  await prettierRun(argv.cwd);

  const { run: eslintRun } = require("../helpers/eslint.js");
  await eslintRun(argv.cwd);
};