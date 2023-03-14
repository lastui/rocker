const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const { setLogLevel } = require("webpack/hot/log");
setLogLevel("none");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const ModuleLocalesPlugin = require("../../plugins/ModuleLocalesPlugin");
const RegisterModuleInjectBuildId = require("../../../babel/plugins/RegisterModuleInjectBuildId");

const babel = require("../../../babel").env.development;

const settings = require("../../settings");

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/development.js"),
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
    manifest: path.resolve(__dirname, "..", "..", "..", "..", "dependencies", "dll", "dependencies-dev-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform-dev-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap-dev-manifest.json"),
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
          entrypoints.push(chunk);
        }
      }

      const headTags = props.htmlWebpackPlugin.tags.headTags.filter(
        (item) => !entrypoints.map((chunk) => path.join(chunk.id, "main.js")).includes(item.attributes.src),
      );

      let manifest;
      try {
        manifest = fs.readFileSync(path.resolve(settings.PROJECT_ROOT_PATH, "manifest.json"), "utf8");
      } catch (_) {
        let entrypoint = null;

        if (entrypoints.length === 1) {
          entrypoint = entrypoints[0].id;
        } else {
          const dependencyGraph = {};

          for (const chunk of entrypoints) {
            props.compilation.chunkGraph.getChunkModulesIterable(chunk).forEach((fragment) => {
              const matchedImports = fragment.dependencies.filter(
                (item) => item.request === "@lastui/rocker/platform" && item.name === "Module",
              );

              if (matchedImports.length > 0) {
                fragment._source._sourceMapAsObject.sourcesContent.forEach((sourceCode) => {
                  const ast = parser.parse(sourceCode, {
                    sourceType: "module",
                    plugins: ["jsx"],
                  });

                  traverse(ast, {
                    CallExpression: (path) => {
                      if (path.node.callee.type !== "MemberExpression") {
                        return;
                      }
                      if (path.node.callee.object.name !== "React") {
                        return;
                      }
                      if (path.node.callee.property.name !== "createElement") {
                        return;
                      }
                      if (path.node.arguments.length < 2) {
                        return;
                      }
                      if (path.node.arguments[0].type !== "Identifier" && path.node.arguments[0].name !== "Module") {
                        return;
                      }
                      if (path.node.arguments[1].type !== "ObjectExpression") {
                        return;
                      }

                      (path.node.arguments[1].properties ?? []).forEach((attribute) => {
                        if (attribute.key.type === "Identifier" && attribute.key.name === "name") {
                          if (!dependencyGraph[chunk.id]) {
                            dependencyGraph[chunk.id] = [];
                          }
                          if (!dependencyGraph[attribute.value.value]) {
                            dependencyGraph[attribute.value.value] = [];
                          }
                          if (!dependencyGraph[attribute.value.value].includes(chunk.id)) {
                            dependencyGraph[attribute.value.value].push(chunk.id);
                          }
                        }
                      });
                    },
                    JSXElement: (path) => {
                      if (path.node.openingElement.name.name !== "Module") {
                        return;
                      }
                      (path.node.openingElement.attributes ?? []).forEach((attribute) => {
                        if (attribute.name.type === "JSXIdentifier" && attribute.name.name === "name") {
                          if (!dependencyGraph[chunk.id]) {
                            dependencyGraph[chunk.id] = [];
                          }
                          if (!dependencyGraph[attribute.value.value]) {
                            dependencyGraph[attribute.value.value] = [];
                          }
                          if (!dependencyGraph[attribute.value.value].includes(chunk.id)) {
                            dependencyGraph[attribute.value.value].push(chunk.id);
                          }
                        }
                      });
                    },
                  });
                });
              }
            });
          }

          const executionOrder = [];
          const visited = {};
          const completed = {};
          const trail = {};

          function walk(node) {
            if (completed[node]) {
              return;
            }
            if (trail[node]) {
              return executionOrder.unshift(node);
            }
            visited[node] = true;
            trail[node] = true;
            dependencyGraph[node].forEach(walk);
            delete trail[node];
            completed[node] = true;
            executionOrder.unshift(node);
          }

          for (const node of Object.keys(dependencyGraph)) {
            if (visited[node]) {
              continue;
            }
            walk(node);
          }

          entrypoint = executionOrder[executionOrder.length - 1];
        }

        const available = entrypoints.map((chunk) => {
          const entry = {
            name: chunk.id,
            program: {
              url: path.join(props.compilation.outputOptions.publicPath, chunk.id, "main.js"),
            },
            locales: {},
            meta: {},
          };
          for (const language of settings.SUPPORTED_LOCALES) {
            entry.locales[language] = path.join(
              props.compilation.outputOptions.publicPath,
              chunk.id,
              "messages",
              `${language}.json`,
            );
          }
          return entry;
        });

        manifest = JSON.stringify({
          entrypoint,
          available,
        });
      }

      return `
        <html>
          <head>
            ${headTags}
          </head>
          <body>
            <script defer>
              (function() {
                "use strict";

                const manifest = ${manifest.trim()};

                window.addEventListener("DOMContentLoaded", function() {
                  const react = dependencies_dll("./node_modules/react/index.js");
                  const dom = dependencies_dll("./node_modules/react-dom/client.js");
                  const bootstrap = bootstrap_dll("./node_modules/@lastui/rocker/bootstrap/index.js");

                  const root = dom.createRoot(document.getElementById("${settings.PROJECT_NAME}"));
                
                  root.render(react.createElement(bootstrap.Main, {
                    fetchContext: async function() {
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
      filepath: path.resolve(__dirname, "..", "..", "..", "..", "dependencies", "dll", "dependencies.dll.js"),
      typeOfAsset: "js",
      attributes: {
        defer: true,
      },
    },
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
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    process: ["process"],
  }),
  new webpack.DefinePlugin(
    Object.entries(process.env).reduce(
      (acc, [k, v]) => {
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
  new webpack.EnvironmentPlugin([...Object.keys(process.env), "NODE_ENV"]),
);

module.exports = config;