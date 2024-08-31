const path = require("path");
const webpack = require("webpack");

const settings = require("../settings");

module.exports = {
  context: process.env.INIT_CWD,
  target: "web",
  externalsType: "var",
  parallelism: 200,
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
      buffer: require.resolve("buffer/"),
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
          "process.env.NODE_ENV": `${process.env.NODE_ENV}`,
          "process.env.NODE_DEBUG": false,
          BUILD_ID: webpack.DefinePlugin.runtimeValue((context) => {
            let name = null;
            for (const entry of context.module.parser.state.compilation.entries) {
              for (const dependency of entry[1].dependencies) {
                if (dependency.request === context.module.resource) {
                  name = entry[0];
                }
              }
            }
            return `"${settings.GET_COUPLING_ID(name)}"`;
          }),
        },
      ),
    ),
  ],
};
