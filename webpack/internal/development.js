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
  devtool: "cheap-module-source-map",
  watch: true,
  devServer: {
    hot: false,
    liveReload: true,
    setupExitSignals: true,
    server: "http",
    static: {
      publicPath: ["/"],
    },
    devMiddleware: {
      publicPath: "/",
      writeToDisk: false,
    },
    allowedHosts: "all",
    historyApiFallback: true,
    compress: false,
    host: "0.0.0.0",
    port: settings.DEV_SERVER_PORT,
    client: {
      reconnect: 2,
      overlay: {
        errors: true,
        runtimeErrors: true,
        warnings: false,
      },
      logging: settings.LOG_LEVEL,
      webSocketURL: {
        hostname: "0.0.0.0",
        pathname: "/ws",
        port: settings.DEV_SERVER_PORT,
      },
    },
  },
};
