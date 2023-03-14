const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const settings = require("../settings");

module.exports = {
  bail: true,
  output: {
    iife: true,
    pathinfo: false,
    chunkLoadingGlobal: "lastuiJsonp",
    chunkLoading: "jsonp",
    wasmLoading: false,
    path: settings.PROJECT_BUILD_PATH,
    publicPath: settings.PROJECT_NAMESPACE,
    globalObject: "this",
    environment: {
      arrowFunction: settings.DEVELOPMENT,
    },
  },
  performance: {
    hints: settings.LOG_LEVEL === "debug" || !settings.DEVELOPMENT ? "warning" : false,
  },
  stats: {
    logging: true,
    colors: true,
    all: settings.LOG_LEVEL === "debug",
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
                ecma: 2021,
                html5_comments: false,
              },
              compress: {
                ecma: 2021,
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
                ecma: 5,
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
