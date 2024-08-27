const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const ImplicitDLLAssetPlugin = require("../../plugins/ImplicitDLLAssetPlugin");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");
const SoftwareBillOfMaterialsPlugin = require("../../plugins/SoftwareBillOfMaterialsPlugin");
const settings = require("../../settings");

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

const linariaBabel = babel.env.test;
const webpackBabel = babel.env.production;

config.output.clean = {
  keep(asset) {
    if (asset.startsWith("spa/")) {
      return false;
    }
    return true;
  },
};

config.output.filename = "spa/[name].min.js";
config.output.assetModuleFilename = "spa/[name][ext][query]";

config.resolve.alias["@lastui/rocker/platform"] = "@lastui/rocker/platform/kernel";

config.module.rules.push(
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
      {
        loader: "@wyw-in-js/webpack-loader",
        options: {
          evaluate: true,
          sourceMap: false,
          displayName: false,
          ignore: [/node_modules/],
          classNameSlug: (hash, title) => `${title}__${hash}`,
          variableNameSlug: (context) => `${context.componentName}-${context.valueSlug}-${context.index}`,
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
    test: /\.(mp3|woff|woff2|svg|eot|otf|ttf|png|jpe?g|gif)(\?.*$|$)/,
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
        manifest: require.resolve(`@lastui/dependencies/dll/${item}-prod-manifest.json`),
        sourceType: "var",
        context: process.env.INIT_CWD,
      }),
  ),
  new webpack.DllReferencePlugin({
    manifest: require.resolve("@lastui/rocker/platform/dll/platform-prod-manifest.json"),
    sourceType: "var",
    context: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: require.resolve("@lastui/rocker/bootstrap/dll/bootstrap-prod-manifest.json"),
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
      minifyJS: true,
      minifyCSS: false,
      minifyURLs: false,
    },
    inject: "head",
    scriptLoading: "defer",
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(process.env.INIT_CWD, "static"),
        to: path.join(config.output.path, "spa"),
        async filter(resourcePath) {
          return !resourcePath.endsWith("index.html");
        },
      },
    ],
  }),
  new ImplicitDLLAssetPlugin([
    ...dependenciesDlls.map((item) => require.resolve(`@lastui/dependencies/dll/${item}.dll.min.js`)),
    require.resolve("@lastui/rocker/platform/dll/platform.dll.min.js"),
    require.resolve("@lastui/rocker/bootstrap/dll/bootstrap.dll.min.js"),
  ]),
  new NormalizedModuleIdPlugin(),
  new SoftwareBillOfMaterialsPlugin({
    filename: (_entrypoint) => "sbom-spa.json",
  }),
);

config.optimization.minimizer.push(new CssMinimizerPlugin({ parallel: true }));

module.exports = config;
