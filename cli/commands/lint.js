exports.command = "lint";

exports.describe = "lint sources";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const { run: runLintStream } = await import("../helpers/lint-stream.mjs");

  await runLintStream(options);
};
