exports.command = "start";

exports.describe = "develop package";

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

  const colors = require("colors/safe");
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup({
    ...argv,
    development: true,
  });
  const config = await getConfig();
  const devServerConfig = config.devServer;
  delete config.devServer;
  const compiler = require("webpack")(config, callback);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log(colors.bold("Compiling..."));
  });
  const server = require("webpack-dev-server");
  const instance = new server(devServerConfig, compiler);
  instance.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};
