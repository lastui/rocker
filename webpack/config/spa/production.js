const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");
const settings = require("../../settings");

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

const linariaBabel = babel.env.test;
const webpackBabel = babel.env.production;

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
        loader: "@wyw-in-js/webpack-loader",
        options: {
          evaluate: true,
          sourceMap: false,
          displayName: false,
          ignore: [/node_modules/],
          classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
          variableNameSlug: (context) =>
            `${settings.PROJECT_NAME}-${context.componentName}-${context.valueSlug}-${context.index}`,
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
        manifest: path.resolve(require.resolve("@lastui/dependencies"), "..", "dll", `${item}-prod-manifest.json`),
        sourceType: "var",
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
      filepath: path.resolve(require.resolve("@lastui/dependencies"), "..", "dll", `${item}.dll.min.js`),
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
  new StatsWriterPlugin({
    filename: path.join("..", "reports", "sbom.json"),
    stats: {
      assets: true,
      dependentModules: true,
    },
    async transform(data) {
      const shared = require("@lastui/dependencies/sbom.json");

      const lockfile = require(
        path.resolve(require.resolve("@lastui/dependencies"), "..", "..", "..", "..", "package-lock.json"),
      );

      const candidates = [];

      for (const asset of data.assets) {
        if (!asset.info.sourceFilename) {
          continue;
        }
        if (!asset.info.sourceFilename.startsWith("node_modules/")) {
          continue;
        }
        if (candidates.indexOf("./" + asset.info.sourceFilename) === -1) {
          candidates.push("./" + asset.info.sourceFilename);
        }
      }

      for (const chunk of data.chunks) {
        for (const entry of chunk.modules) {
          if (entry.moduleType === "asset/inline") {
            if (!entry.id.startsWith("./node_modules/")) {
              continue;
            }
            if (candidates.indexOf(entry.id) === -1) {
              candidates.push(entry.id);
            }
          } else {
            for (const reason of entry.reasons) {
              if (!reason.resolvedModuleId) {
                continue;
              }
              if (!reason.resolvedModuleId.startsWith("./node_modules/")) {
                continue;
              }
              if (candidates.indexOf(reason.resolvedModuleId) === -1) {
                candidates.push(reason.resolvedModuleId);
              }
            }
          }
        }
      }

      const report = {};

      for (const candidate of candidates) {
        const parts = candidate.substring(15).split("/");
        const item = candidate[15] === "@" ? parts[0] + "/" + parts[1] : parts[0];

        if (item in shared) {
          continue;
        }

        report[item] = "*";
      }

      for (const item in report) {
        const entry = lockfile.packages["node_modules/" + item];
        if (!entry) {
          delete report[item];
        } else {
          report[item] = entry.version;
        }
      }

      return JSON.stringify(report, null, 2);
    },
  }),
);

module.exports = config;
