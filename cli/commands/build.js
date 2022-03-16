exports.command = "build";

exports.describe = "bundle package";

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

  const config = require(path.resolve("./webpack.config.js"));

  if (!config.infrastructureLogging) {
    config.infrastructureLogging = { level: "info" };
  }
  config.infrastructureLogging.stream = process.stdout;

  const callback = await webpackCallback(argv);
  webpack(config).run(callback);
};
