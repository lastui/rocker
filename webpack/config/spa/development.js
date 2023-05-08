const path = require("path");
const webpack = require("webpack");

const { setLogLevel } = require("webpack/hot/log");
setLogLevel("none");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const dependenciesDlls = require("@lastui/dependencies");

const settings = require("../../settings");
const webpackBabel = require("../../../babel").env.development;
const linariaBabel = require("../../../babel").env.test;

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/development.js"),
};

config.devServer = {
  hot: true,
  liveReload: false,
  setupExitSignals: true,
  static: {
    publicPath: ["/"],
  },
  devMiddleware: {
    publicPath: "/",
    writeToDisk: false,
  },
  https: false,
  allowedHosts: "all",
  historyApiFallback: true,
  compress: false,
  host: "0.0.0.0",
  port: settings.DEV_SERVER_PORT,
  client: {
    overlay: {
      errors: true,
      warnings: false,
    },
    logging: settings.LOG_LEVEL,
    webSocketURL: {
      hostname: "0.0.0.0",
      pathname: "/ws",
      port: settings.DEV_SERVER_PORT,
    },
  },
};

config.output.filename = "[name].js";

config.resolve.alias["react-dom$"] = "react-dom/profiling";
config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";

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
              return [preset, {}, `babel-${preset}`];
            } else {
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
          compact: false,
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
        loader: "style-loader",
        options: {
          injectType: "singletonStyleTag",
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
    test: /\.(png|jpe?g|gif)$/i,
    dependency: { not: ["url"] },
    type: "asset/inline",
  },
  {
    test: /\.(woff|woff2|svg|eot|otf|ttf)(\?.*$|$)/,
    type: "asset/resource",
  },
);

config.plugins.push(
  ...dependenciesDlls.map(
    (item) =>
      new webpack.DllReferencePlugin({
        manifest: path.resolve(require.resolve("@lastui/dependencies"), "..", "dll", `${item.name}-dev-manifest.json`),
        sourceType: item.type,
        context: process.env.INIT_CWD,
      }),
  ),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform-dev-manifest.json"),
    sourceType: "umd",
    context: process.env.INIT_CWD,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap-dev-manifest.json"),
    sourceType: "umd",
    context: process.env.INIT_CWD,
  }),
  new HTMLWebpackPlugin({
    template: path.resolve(process.env.INIT_CWD, "static", "index.html"),
    production: false,
    publicPath: "/",
    minify: false,
    inject: "head",
    scriptLoading: "defer",
  }),
  new AddAssetHtmlPlugin([
    ...dependenciesDlls.map((item) => ({
      filepath: path.resolve(require.resolve("@lastui/dependencies"), "..", "dll", `${item.name}.dll.js`),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    })),
    {
      filepath: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
    {
      filepath: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
  ]),
);

module.exports = config;
