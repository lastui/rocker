const webpack = require("webpack");

const config = require("../webpack/config/dll");
const settings = require("../webpack/settings");

config.entry = {
  bootstrap: ["@lastui/rocker/bootstrap"],
};

config.resolve.alias["@lastui/rocker/platform"] = "@lastui/rocker/platform/kernel";

config.plugins.push(
  new webpack.DllReferencePlugin({
    manifest: require.resolve(`@lastui/dependencies/dll/dependencies-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`),
    context: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: require.resolve(`@lastui/rocker/platform/dll/platform-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`),
    context: process.env.INIT_CWD,
  }),
);

module.exports = config;
