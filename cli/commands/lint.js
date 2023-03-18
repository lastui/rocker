exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const colors = require("ansi-colors");

  if (!options.quiet) {
    console.log(colors.bold("Running Prettier"));
  }
  const { run: prettierRun } = require("../helpers/prettier.js");
  await prettierRun(options);

  if (!options.quiet) {
    console.log(colors.bold("Running ESlint"));
  }
  const { run: eslintRun } = require("../helpers/eslint.js");
  await eslintRun(options);
};
