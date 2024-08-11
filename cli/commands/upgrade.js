exports.command = "upgrade";

exports.describe = "upgrade to latest compatible";

exports.builder = {};

exports.handler = async function (options, _cleanupHooks) {
  const { run: runUpgrade } = await import("../helpers/upgrade.mjs");

  await runUpgrade(options);
};
