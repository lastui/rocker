exports.command = "test";

exports.describe = "run unit tests";

exports.builder = {};

exports.handler = async function (options, _cleanupHooks) {
  const { run: runJest } = await import("../helpers/jest.mjs");

  await runJest(options);
};
