const path = require("path");
const webpack = require("webpack");

const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");

const settings = require("../../settings");

const webpackBabel = require("../../../babel").env[settings.DEVELOPMENT ? "development" : "production"];
const linariaBabel = require("../../../babel").env.test;

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

config.output.path = settings.DLL_BUILD_PATH;
config.output.filename = `[name].dll${settings.DEVELOPMENT ? "" : ".min"}.js`;
config.output.library = {
  name: "[name]_dll",
  type: "var",
};

config.module.rules.push(
  {
    test: /\.[j|t]sx?$/,
    enforce: "pre",
    use: [
      {
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: webpackBabel.presets.map((preset) => {
            if (typeof preset === "string") {
              return [preset, {}, `babel-${preset}`];
            } else {
              return [preset[0], preset[1], `babel-${preset[0]}`];
            }
          }),
          plugins: webpackBabel.plugins.map((plugin) => {
            if (typeof plugin === "string") {
              return [plugin, {}, `babel-${plugin}`];
            } else {
              return [plugin[0], plugin[1], `babel-${plugin[0].name || plugin[0]}`];
            }
          }),
          assumptions: webpackBabel.assumptions,
          cacheDirectory: path.join(settings.WEBPACK_ROOT_PATH, ".babel-cache"),
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
);

config.plugins.push(
  new webpack.DllPlugin({
    entryOnly: false,
    format: true,
    context: process.env.INIT_CWD,
    path: path.join(settings.DLL_BUILD_PATH, `[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`),
    name: "[name]_dll",
  }),
  new NormalizedModuleIdPlugin(),
);

module.exports = config;