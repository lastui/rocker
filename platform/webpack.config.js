const path = require("path");
const webpack = require("webpack");

const config = require("../webpack/config/dll");
const settings = require("../webpack/settings");

config.entry = {
  platform: ["@lastui/rocker/platform", "@lastui/rocker/platform/kernel"],
};

config.plugins.push(
  new webpack.DllReferencePlugin({
    manifest: path.resolve(
      __dirname,
      "node_modules",
      "@lastui",
      "dependencies",
      "dll",
      `dependencies-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`,
    ),
    context: process.env.INIT_CWD,
  }),
);

module.exports = config;
