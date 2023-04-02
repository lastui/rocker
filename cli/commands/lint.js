exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const { run } = require("../helpers/lint-stream");
  await run(options);
};
