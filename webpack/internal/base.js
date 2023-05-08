const path = require("path");
const settings = require("../settings");

module.exports = {
  context: process.env.INIT_CWD,
  target: "web",
  externalsType: "var",
  mode: settings.DEVELOPMENT ? "development" : "production",
  resolve: {
    unsafeCache: false,
    preferRelative: false,
    preferAbsolute: true,
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    mainFields: ["browser", "module", "main"],
    enforceExtension: false,
    symlinks: false,
    fallback: {
      process: false,
      path: require.resolve("path-browserify"),
      util: require.resolve("util/"),
      fs: false,
      crypto: false,
    },
    alias: {},
    roots: [process.env.INIT_CWD],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        parser: { requireEnsure: false },
      },
      {
        test: /\.json5?$/,
        type: "javascript/auto",
        loader: "json5-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  cache: {
    type: "memory",
  },
  snapshot: {
    managedPaths: [path.resolve(process.env.INIT_CWD, "node_modules")],
  },
};
