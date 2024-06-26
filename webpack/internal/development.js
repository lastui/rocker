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
    all: settings.LOG_LEVEL === "verbose",
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
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: ["process"],
    }),
    new webpack.DefinePlugin(
      Object.entries(process.env).reduce(
        (acc, [k, v]) => {
          if (k.startsWith("npm_")) {
            return acc;
          }
          if (acc[k] === undefined) {
            switch (typeof v) {
              case "boolean":
              case "number": {
                acc[`process.env.${k}`] = v;
                break;
              }
              default: {
                acc[`process.env.${k}`] = `"${v}"`;
                break;
              }
            }
          }
          return acc;
        },
        {
          process: {},
          "process.env": {},
          "process.env.NODE_ENV": `"development"`,
          "process.env.NODE_DEBUG": false,
          BUILD_ID: `"${settings.BUILD_ID}"`,
        },
      ),
    ),
  ],
  watch: true,
};
