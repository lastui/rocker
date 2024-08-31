const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { JSDOM } = require("jsdom");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const ImplicitDLLAssetPlugin = require("../../plugins/ImplicitDLLAssetPlugin");
const SoftwareBillOfMaterialsPlugin = require("../../plugins/SoftwareBillOfMaterialsPlugin");
const settings = require("../../settings");

const linariaBabel = babel.env.test;
const webpackBabel = babel.env.production;

module.exports = merge(require("../../internal/base.js"), require("../../internal/build.js"), {
  resolve: {
    alias: {
      "@lastui/rocker/platform": "@lastui/rocker/platform/kernel",
    },
  },
  output: {
    filename: "spa/main.min.js",
    assetModuleFilename: "spa/[name][ext][query]",
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin({ parallel: true })],
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
    ],
  },
  plugins: [
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
      templateContent: (props) => {
        const origin = path.dirname(props.compilation.entrypoints.entries().next().value[1].origins[0].request);
        const data = props.compilation.compiler.inputFileSystem.readFileSync(path.resolve(origin, "index.html"));
        const DOM = new JSDOM(data, { contentType: "text/html" });
        DOM.window.document.head.innerHTML = props.htmlWebpackPlugin.tags.headTags.map((item) => item.toString()).join("");
        return DOM.serialize();
      },
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
    new ImplicitDLLAssetPlugin([
      ...dependenciesDlls.map((item) => require.resolve(`@lastui/dependencies/dll/${item}.dll.min.js`)),
      require.resolve("@lastui/rocker/platform/dll/platform.dll.min.js"),
      require.resolve("@lastui/rocker/bootstrap/dll/bootstrap.dll.min.js"),
    ]),
    new SoftwareBillOfMaterialsPlugin({
      filename(_entrypoint) {
        return "sbom-spa.json";
      },
    }),
  ],
});
