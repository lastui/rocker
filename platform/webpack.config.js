const path = require("path");
const webpack = require("webpack");
const settings = require("../webpack/settings");
const config = require("../webpack/config/dll");

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
    context: settings.PROJECT_ROOT_PATH,
  }),
);

module.exports = config;