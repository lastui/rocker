const webpack = require("webpack");

const settings = require("../settings");

module.exports = {
  bail: false,
  output: {
    pathinfo: false,
    chunkLoadingGlobal: "lastuiJsonp",
    chunkLoading: "jsonp",
    publicPath: settings.PROJECT_NAMESPACE,
  },
  performance: {
    hints: false,
  },
  stats: {
    colors: process.stdout.isTTY,
    all: settings.LOG_LEVEL === "debug",
    assets: false,
    chunks: false,
    source: false,
    modules: true,
    timings: true,
    errors: true,
    errorDetails: true,
    errorStack: true,
  },
  devtool: "eval-cheap-module-source-map",
  plugins: [],
  watch: true,
};
