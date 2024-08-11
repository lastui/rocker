const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const settings = require("../settings");

module.exports = {
  bail: true,
  output: {
    iife: true,
    pathinfo: false,
    chunkLoadingGlobal: "lastuiJsonp",
    chunkLoading: "jsonp",
    wasmLoading: false,
    path: path.resolve(process.env.INIT_CWD, "build"),
    publicPath: settings.PROJECT_NAMESPACE,
    globalObject: "this",
    environment: {
      arrowFunction: settings.DEVELOPMENT,
    },
  },
  performance: {
    hints: settings.LOG_LEVEL === "verbose" || !settings.DEVELOPMENT ? "warning" : false,
  },
  stats: {
    logging: true,
    colors: process.stdout.isTTY,
    all: settings.LOG_LEVEL === "verbose",
    assets: false,
    modules: true,
    chunks: false,
    source: false,
    timings: true,
    errors: true,
    errorDetails: true,
    errorStack: true,
  },
  devtool: false,
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    providedExports: true,
    flagIncludedChunks: true,
    chunkIds: "named",
    moduleIds: "named",
    usedExports: true,
    sideEffects: false,
    emitOnErrors: true,
    concatenateModules: true,
    runtimeChunk: false,
    minimize: !settings.DEVELOPMENT,
    minimizer: settings.DEVELOPMENT
      ? []
      : [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              sourceMap: false,
              toplevel: false,
              parse: {
                ecma: 2023,
                html5_comments: false,
              },
              compress: {
                ecma: 2023,
                warnings: false,
                comparisons: false,
                inline: 2,
                arrows: false,
                booleans_as_integers: false,
                computed_props: true,
                dead_code: true,
                drop_debugger: true,
              },
              output: {
                ecma: 2023,
                comments: false,
                ascii_only: true,
                indent_level: 0,
                comments: false,
              },
            },
            parallel: true,
          }),
        ],
  },
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
    ...(settings.PROGRESS
      ? [
          new webpack.ProgressPlugin({
            percentBy: "entries",
            activeModules: false,
            entries: true,
            modules: true,
            profile: true,
            dependencies: true,
          }),
        ]
      : []),
  ],
};
