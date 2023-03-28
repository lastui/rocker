const path = require("path");
const webpack = require("webpack");

const ModuleLocalesPlugin = require("../../plugins/ModuleLocalesPlugin");
const RegisterModuleInjectBuildId = require("../../../babel/plugins/RegisterModuleInjectBuildId");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");

const settings = require("../../settings");

const webpackBabel = require("../../../babel").env.production;
const linariaBabel = require("../../../babel").env.test;

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

config.output.clean = {
  keep(asset) {
    for (const entry in config.entry) {
      if (asset.startsWith(`module/${entry}/`)) {
        return false;
      }
    }
    return true;
  },
};

config.output.filename = "module/[name]/main.min.js";
config.output.assetModuleFilename = "module/[name][ext][query]";

config.resolve.alias["@lastui/rocker/platform/kernel"] = "@lastui/rocker/platform";

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
          plugins: [RegisterModuleInjectBuildId, ...webpackBabel.plugins].map((plugin) => {
            if (!Array.isArray(plugin)) {
              return [plugin, {}, `babel-${plugin.name || plugin}`];
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
          ignore: [/node_modules/],
          cacheDirectory: path.join(settings.WEBPACK_ROOT_PATH, ".linaria-cache"),
          classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
          babelOptions: {
            babelrc: false,
            presets: linariaBabel.presets.map((preset) => {
              if (!Array.isArray(preset)) {
                return [preset, {}, `linaria-${preset}`];
              } else {
                return [preset[0], preset[1], `linaria-${preset[0]}`];
              }
            }),
            plugins: linariaBabel.plugins.map((plugin) => {
              if (!Array.isArray(plugin)) {
                return [plugin, {}, `linaria-${plugin.name || plugin}`];
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
  {
    test: /\.(mp3|png|jpe?g|gif)$/i,
    dependency: { not: ["url"] },
    type: "asset/inline",
  },
  {
    test: /\.css$/i,
    use: [
      {
        loader: "style-loader",
        options: {
          injectType: "singletonStyleTag",
          attributes: {
            id: `rocker-${settings.BUILD_ID}`,
          },
        },
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: false,
          modules: false,
          importLoaders: 0,
        },
      },
    ],
  },
  {
    test: /\.s[a|c]ss$/,
    use: [
      {
        loader: "style-loader",
        options: {
          injectType: "singletonStyleTag",
          attributes: {
            id: `rocker-${settings.BUILD_ID}`,
          },
        },
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: false,
          modules: false,
          importLoaders: 0,
        },
      },
      {
        loader: "sass-loader",
        options: {
          implementation: require("sass"),
          sassOptions: {
            fiber: false,
          },
          sourceMap: false,
        },
      },
    ],
  },
  {
    test: /\.(png|jpg|gif)$/i,
    type: "asset/inline",
  },
);

config.plugins.push(
  new ModuleLocalesPlugin({
    from: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "..", "dependencies", "dll", "dependencies-prod-manifest.json"),
    sourceType: "var",
    context: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform-prod-manifest.json"),
    sourceType: "var",
    context: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap-prod-manifest.json"),
    sourceType: "var",
    context: process.env.INIT_CWD,
  }),
  new NormalizedModuleIdPlugin(),
);

module.exports = config;
