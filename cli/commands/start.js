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

  const { webpackCallback } = require("../helpers/webpack.js");

  const path = require("path");
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const config = require(path.resolve("./webpack.config.js"));

  if (!config.infrastructureLogging) {
    config.infrastructureLogging = { level: "info" };
  }
  config.infrastructureLogging.stream = process.stdout;

  const devServerConfig = config.devServer;
  delete config.devServer;
  const callback = await webpackCallback({
    ...argv,
    development: true,
  });
  const compiler = webpack(config, callback);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log(colors.bold("Compiling..."));
  });
  const devServer = new WebpackDevServer(devServerConfig, compiler);
  devServer.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => devServer.close());
};
