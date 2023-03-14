const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");

const settings = require("../../settings");

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

config.target = "node";
config.externalsType = "commonjs";
config.output.path = settings.PROJECT_BUILD_PATH;
config.output.filename = "[name]/index.js";
config.output.library = {
  name: "[name]",
  type: "commonjs2",
};

config.optimization.minimize = true;
config.optimization.minimizer = [
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
];

delete config.resolve.fallback;

module.exports = config;
