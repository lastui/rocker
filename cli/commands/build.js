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

  if (argv.silent) {
    process.env.PROGRESS === "true";
  }

  process.env.NODE_ENV = argv.development ? "development" : "production";

  process.env.BABEL_ENV = process.env.NODE_ENV;

  const { webpackCallback } = require("../helpers/webpack.js");

  const path = require("path");
  const webpack = require("webpack");

  const config = require(path.resolve("./webpack.config.js"));

  if (!config.infrastructureLogging) {
    config.infrastructureLogging = { level: "info" };
  }
  config.infrastructureLogging.stream = process.stdout;

  const callback = await webpackCallback();
  webpack(config).run(callback);
};
