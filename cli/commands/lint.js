exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const colors = require("ansi-colors");

  console.log(colors.bold("Running Prettier"));
  const { run: prettierRun } = require("../helpers/prettier.js");
  await prettierRun(argv);

  console.log(colors.bold("Running ESlint"));
  const { run: eslintRun } = require("../helpers/eslint.js");
  await eslintRun(argv);
};
