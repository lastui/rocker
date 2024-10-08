const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const babel = require("../../../babel");
const settings = require("../../settings");

const webpackBabel = babel.env[settings.DEVELOPMENT ? "development" : "production"];

module.exports = merge(require("../../internal/base.js"), require("../../internal/build.js"), {
  output: {
    clean: false,
    path: path.resolve(process.env.INIT_CWD, "dll"),
    filename: `[name].dll${settings.DEVELOPMENT ? "" : ".min"}.js`,
    library: {
      name: "rocker_so_[name]",
      type: "var",
    },
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        enforce: "pre",
        include: /.*/,
        exclude: /node_modules\/(?!@lastui)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: webpackBabel.presets.map((preset) => {
                if (!Array.isArray(preset)) {
                  if (preset === "@babel/preset-env") {
                    return [preset, { debug: settings.LOG_LEVEL === "verbose" }, `babel-${preset}`];
                  }
                  return [preset, {}, `babel-${preset}`];
                } else {
                  if (preset[0] === "@babel/preset-env") {
                    preset[1].debug = settings.LOG_LEVEL === "verbose";
                  }
                  return [preset[0], preset[1], `babel-${preset[0]}`];
                }
              }),
              plugins: webpackBabel.plugins.map((plugin) => {
                if (!Array.isArray(plugin)) {
                  return [plugin, {}, `babel-${plugin.name || plugin}`];
                } else {
                  return [plugin[0], plugin[1], `babel-${plugin[0].name || plugin[0]}`];
                }
              }),
              assumptions: webpackBabel.assumptions,
              cacheDirectory: true,
              sourceMaps: false,
              sourceType: "module",
              highlightCode: true,
              shouldPrintComment: (val) => /license/.test(val),
              compact: true,
              inputSourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.txt$/,
        type: "asset/source",
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
  plugins: [
    new webpack.DllPlugin({
      entryOnly: false,
      format: true,
      context: process.env.INIT_CWD,
      path: path.join(process.env.INIT_CWD, "dll", `[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`),
      name: "rocker_so_[name]",
    }),
  ],
});
