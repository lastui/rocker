const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const { setLogLevel } = require("webpack/hot/log");
setLogLevel("none");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const ModuleLocalesPlugin = require("../plugins/ModuleLocalesPlugin");
const RegisterModuleInjectBuildId = require("../../babel/plugins/RegisterModuleInjectBuildId");

const babel = require("../../babel").env.development;

const settings = require("../settings");

const config = {
  ...require("../internal/base.js"),
  ...require("../internal/development.js"),
};

config.devServer = {
  hot: false,
  liveReload: true,
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

config.output.filename = "[name]/main.js";

config.resolve.alias["react-dom$"] = "react-dom/profiling";
config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";
config.resolve.alias["@lastui/rocker/platform/kernel"] = "@lastui/rocker/platform";

config.module.rules.push(
  {
    test: /\.[j|t]sx?$/,
    enforce: "pre",
    exclude: [/node_modules\/(?!(\@lastui*))/],
    use: [
      {
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: babel.presets.map((preset) => {
            if (!Array.isArray(preset)) {
              return [preset, {}, `babel-${preset}`];
            } else {
              return [preset[0], preset[1], `babel-${preset[0]}`];
            }
          }),
          plugins: [RegisterModuleInjectBuildId, ...babel.plugins].map((plugin) => {
            if (!Array.isArray(plugin)) {
              return [plugin, {}, `babel-${plugin.name || plugin}`];
            } else {
              return [plugin[0], plugin[1], `babel-${plugin[0].name || plugin[0]}`];
            }
          }),
          cacheDirectory: path.join(settings.WEBPACK_ROOT_PATH, ".babel-cache"),
          sourceMaps: true,
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
          sourceMap: true,
          preprocessor: "stylis",
          cacheDirectory: path.join(settings.WEBPACK_ROOT_PATH, ".linaria-cache"),
          classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
          babelOptions: {
            babelrc: false,
            presets: babel.presets
              .map((preset) => {
                if (!Array.isArray(preset)) {
                  return [preset, {}, `linaria-${preset}`];
                } else {
                  return [preset[0], preset[1], `linaria-${preset[0]}`];
                }
              })
              .filter((preset) => preset[0] !== "@babel/preset-env"),
            plugins: babel.plugins.map((plugin) => {
              if (!Array.isArray(plugin)) {
                return [plugin, {}, `linaria-${plugin.name || plugin}`];
              } else {
                return [plugin[0], plugin[1], `linaria-${plugin[0].name || plugin[0]}`];
              }
            }),
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
          sourceMap: true,
          importLoaders: 1,
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
          sourceMap: true,
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
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(png|jpg|gif)$/i,
    dependency: { not: ["url"] },
    type: "asset/inline",
  },
  {
    test: /\.(woff|woff2|svg|eot|otf|ttf)(\?.*$|$)/,
    type: "asset/resource",
  },
);

config.plugins.push(
  new webpack.DllReferencePlugin({
    manifest: path.resolve(require.resolve("@lastui/dependencies"), "../dll/dependencies-dev-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "../../platform/dll/platform-dev-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "../../bootstrap/dll/bootstrap-dev-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new ModuleLocalesPlugin({
    from: settings.PROJECT_ROOT_PATH,
  }),
  new HTMLWebpackPlugin({
    production: false,
    publicPath: "",
    minify: false,
    inject: false,
    scriptLoading: "defer",
    templateContent: (props) => {
      let entrypoints = [];

      for (const entryPoint of props.compilation.entrypoints.values()) {
        for (const chunk of entryPoint.chunks) {
          entrypoints.push(chunk.name);
        }
      }

      const headTags = props.htmlWebpackPlugin.tags.headTags.filter(
        (item) => !entrypoints.map((name) => `${name}/main.js`).includes(item.attributes.src),
      );

      let manifest;
      try {
        manifest = fs.readFileSync(path.resolve(process.cwd(), "manifest.json"), "utf8");
      } catch (_) {
        const hotModules = entrypoints.map((name) => {
          const hotModule = {
            id: name,
            program: {
              url: `${props.compilation.outputOptions.publicPath}${name}/main.js`,
            },
            locales: {},
            meta: {},
          };
          for (const language of settings.SUPPORTED_LOCALES) {
            hotModule.locales[
              language
            ] = `${props.compilation.outputOptions.publicPath}${name}/messages/${language}.json`;
          }
          return hotModule;
        });
        manifest = JSON.stringify({
          entrypoint: entrypoints.find((name) => name === settings.PROJECT_NAME) || entrypoints[0],
          available: hotModules,
        });
      }

      return `
        <html>
          <head>
            ${headTags}
          </head>
          <body>
            <script defer>
              (function(){
                "use strict";

                const manifest = ${manifest.trim()};

                window.addEventListener("DOMContentLoaded", function() {
                  const react = dependencies_dll("./node_modules/react/index.js");
                  const dom = dependencies_dll("./node_modules/react-dom/client.js");
                  const bootstrap = bootstrap_dll("./node_modules/@lastui/rocker/bootstrap/index.js");

                  const root = dom.createRoot(document.getElementById("${settings.PROJECT_NAME}"));
                
                  root.render(react.createElement(bootstrap.component, {
                    fetchContext: async function() {
                      console.debug('using context', manifest);
                      return manifest;
                    }
                  }));
                })
              }())
            </script>
            <div id="${settings.PROJECT_NAME}" />
          </body>
        </html>
      `;
    },
  }),
  new AddAssetHtmlPlugin([
    {
      filepath: path.resolve(require.resolve("@lastui/dependencies"), "../dll/dependencies.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
    {
      filepath: path.resolve(__dirname, "../../platform/dll/platform.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
    {
      filepath: path.resolve(__dirname, "../../bootstrap/dll/bootstrap.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
  ]),
);

module.exports = config;