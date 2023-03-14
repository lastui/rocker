exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const { run: prettierRun } = require("../helpers/prettier.js");
  await prettierRun(argv);

  const { run: eslintRun } = require("../helpers/eslint.js");
  await eslintRun(argv);
};
