const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");

const dependenciesDlls = require("@lastui/dependencies");

const settings = require("../../settings");
const webpackBabel = require("../../../babel").env.production;
const linariaBabel = require("../../../babel").env.test;

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

config.output.clean = {
  keep(asset) {
    return !asset.startsWith("spa/");
  },
};

config.output.filename = "spa/[name].min.js";
config.output.assetModuleFilename = "spa/[name][ext][query]";

config.resolve.alias["@lastui/rocker/platform"] = "@lastui/rocker/platform/kernel";

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
          plugins: webpackBabel.plugins.map((plugin) => {
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
    test: /\.css$/i,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
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
        loader: MiniCssExtractPlugin.loader,
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
    test: /\.(woff|woff2|svg|eot|otf|ttf|png|jpe?g|gif)(\?.*$|$)/,
    type: "asset/resource",
  },
);

config.plugins.push(
  new MiniCssExtractPlugin({
    filename: "spa/[name].css",
    chunkFilename: "spa/[id].css",
    linkType: "text/css",
    ignoreOrder: false,
  }),
  ...dependenciesDlls.map(
    (item) =>
      new webpack.DllReferencePlugin({
        manifest: path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "dependencies",
          "dll",
          `${item.name}-prod-manifest.json`,
        ),
        sourceType: item.type,
        context: process.env.INIT_CWD,
      }),
  ),
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
  new HTMLWebpackPlugin({
    template: path.resolve(process.env.INIT_CWD, "static", "index.html"),
    filename: "spa/index.html",
    production: true,
    publicPath: settings.PROJECT_NAMESPACE,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundandAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: false,
      keepClosingSlash: true,
      minifyJS: false,
      minofyCSS: false,
      minifyURLs: false,
    },
    inject: "head",
    scriptLoading: "defer",
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(process.env.INIT_CWD, "static"),
        to: path.join(settings.PROJECT_BUILD_PATH, "spa"),
        filter: async (resourcePath) => !resourcePath.endsWith("index.html"),
      },
    ],
  }),
  new AddAssetHtmlPlugin([
    ...dependenciesDlls.map((item) => ({
      filepath: path.resolve(__dirname, "..", "..", "..", "..", "dependencies", "dll", `${item.name}.dll.min.js`),
      outputPath: "spa",
      publicPath: `${settings.PROJECT_NAMESPACE}spa`,
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    })),
    {
      filepath: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform.dll.min.js"),
      outputPath: "spa",
      publicPath: `${settings.PROJECT_NAMESPACE}spa`,
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
    {
      filepath: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap.dll.min.js"),
      outputPath: "spa",
      publicPath: `${settings.PROJECT_NAMESPACE}spa`,
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
  ]),
  new NormalizedModuleIdPlugin(),
);

module.exports = config;
