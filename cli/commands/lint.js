exports.command = "lint";

exports.describe = "run static analysis";

exports.builder = {};

exports.handler = async function (options, _cleanupHooks) {
  const { run: runLintStream } = await import("../helpers/lint-stream.mjs");

  await runLintStream(options);
};
