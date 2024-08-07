exports.command = "upgrade";

exports.describe = "upgrade version to latest";

exports.builder = {};

exports.handler = async function (options, _cleanupHooks) {
  const { run } = await import("../helpers/upgrade.mjs");

  await run(options);
};
