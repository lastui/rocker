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
      {
        loader: "@linaria/webpack5-loader",
        options: {
          sourceMap: false,
          preprocessor: "stylis",
          cacheDirectory: path.join(settings.WEBPACK_ROOT_PATH, ".linaria-cache"),
          classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
          babelOptions: {
            babelrc: false,
            presets: linariaBabel.presets.map((preset) => {
              if (typeof preset === "string") {
                return [preset, {}, `linaria-${preset}`];
              } else {
                return [preset[0], preset[1], `linaria-${preset[0]}`];
              }
            }),
            plugins: linariaBabel.plugins.map((plugin) => {
              if (typeof plugin === "string") {
                return [plugin, {}, `linaria-${plugin}`];
              } else {
                return [plugin[0], plugin[1], `linaria-${plugin[0].name || plugin[0]}`];
              }
            }),
            assumptions: linariaBabel.assumptions,
            sourceMaps: false,
            sourceType: "module",
            inputSourceMap: false,
          },
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
    context: settings.PROJECT_ROOT_PATH,
    path: path.join(settings.DLL_BUILD_PATH, `[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`),
    name: "[name]_dll",
  }),
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    process: ["process"],
  }),
  new webpack.DefinePlugin(
    Object.entries(process.env).reduce(
      (acc, [k, v]) => {
        if (k.startsWith('npm_')) {
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
  new NormalizedModuleIdPlugin(),
);

module.exports = config;