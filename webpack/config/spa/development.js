const HTMLWebpackPlugin = require("html-webpack-plugin");
const { JSDOM } = require("jsdom");
const path = require("path");
const webpack = require("webpack");
const { setLogLevel } = require("webpack/hot/log");
const { merge } = require("webpack-merge");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const ImplicitDLLAssetPlugin = require("../../plugins/ImplicitDLLAssetPlugin");

setLogLevel("none");

const webpackBabel = babel.env.development;
const linariaBabel = babel.env.test;

module.exports = merge(require("../../internal/base.js"), require("../../internal/development.js"), {
  resolve: {
    alias: {
      "react-dom$": "react-dom/profiling",
      "scheduler/tracing": "scheduler/tracing-profiling",
      "@lastui/rocker/platform": "@lastui/rocker/platform/kernel",
    },
  },
  output: {
    filename: "[name].js",
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
              cacheDirectory: true,
              sourceMaps: false,
              sourceType: "module",
              highlightCode: true,
              shouldPrintComment: (val) => /license/.test(val),
              compact: false,
              inputSourceMap: false,
            },
          },
          {
            loader: "@wyw-in-js/webpack-loader",
            options: {
              evaluate: true,
              sourceMap: true,
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
                sourceMaps: true,
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
        test: /\.(png|jpe?g|gif)$/i,
        dependency: { not: ["url"] },
        type: "asset/inline",
      },
      {
        test: /\.(woff|woff2|svg|eot|otf|ttf)(\?.*$|$)/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    ...dependenciesDlls.map(
      (item) =>
        new webpack.DllReferencePlugin({
          manifest: require.resolve(`@lastui/dependencies/dll/${item}-dev-manifest.json`),
          sourceType: "var",
          context: process.env.INIT_CWD,
        }),
    ),
    new webpack.DllReferencePlugin({
      manifest: require.resolve("@lastui/rocker/platform/dll/platform-dev-manifest.json"),
      sourceType: "var",
      context: process.env.INIT_CWD,
    }),
    new webpack.DllReferencePlugin({
      manifest: require.resolve("@lastui/rocker/bootstrap/dll/bootstrap-dev-manifest.json"),
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
      production: false,
      publicPath: "/",
      minify: false,
      inject: "head",
      scriptLoading: "defer",
    }),
    new ImplicitDLLAssetPlugin([
      ...dependenciesDlls.map((item) => require.resolve(`@lastui/dependencies/dll/${item}.dll.js`)),
      require.resolve("@lastui/rocker/platform/dll/platform.dll.js"),
      require.resolve("@lastui/rocker/bootstrap/dll/bootstrap.dll.js"),
    ]),
  ],
});
