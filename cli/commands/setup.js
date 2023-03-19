exports.command = "setup";

exports.describe = false;

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  await require("../setup/eslint")();
};
