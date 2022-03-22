exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  cleanupHooks.push(() => process.exit(process.exitCode || 0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, async () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(argv);
  const config = await getConfig();
  const server = require("webpack");

  server(config).run(callback);
};
