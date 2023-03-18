exports.command = "test";

exports.describe = "run unit tests";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const { run } = require("../helpers/jest.js");
  await run(options);
};
