exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  cleanupHooks.push(() => process.exit(process.exitCode || 0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

  const path = require("path");
  const packageName = path.basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(argv, packageName);
  const config = await getConfig();
  const server = require("webpack");

  server(config).run(callback);
};