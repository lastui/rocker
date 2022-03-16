exports.command = "start";

exports.describe = "develop package";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  cleanupHooks.push(() => process.exit(0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, async () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

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
  const devServer = new require("webpack-dev-server")(
    devServerConfig,
    compiler
  );
  devServer.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => devServer.close());
};
