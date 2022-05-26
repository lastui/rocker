const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require(path.resolve(__dirname, "../settings"));

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
    colors: true,
    all: false,
    assets: false,
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
    new webpack.EnvironmentPlugin([...Object.keys(process.env), "NODE_ENV"]),
  ],
  watch: true,
};