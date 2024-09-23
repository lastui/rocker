const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { setLogLevel } = require("webpack/hot/log");
const { merge } = require("webpack-merge");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const RegisterModuleInjectBuildId = require("../../../babel/plugins/RegisterModuleInjectBuildId");
const ImplicitDLLAssetPlugin = require("../../plugins/ImplicitDLLAssetPlugin");
const ModuleLocalesPlugin = require("../../plugins/ModuleLocalesPlugin");
const settings = require("../../settings");

setLogLevel("none");

const webpackBabel = babel.env.development;
const linariaBabel = babel.env.test;

module.exports = merge(require("../../internal/base.js"), require("../../internal/development.js"), {
  resolve: {
    alias: {
      "react-dom$": "react-dom/profiling",
      "scheduler/tracing": "scheduler/tracing-profiling",
      "@lastui/rocker/platform/kernel": "@lastui/rocker/platform",
      "@lastui/rocker/register": path.resolve(__dirname, "..", "..", "loaders", "ModuleRegistration", "runtime.js"),
    },
  },
  output: {
    filename(pathData) {
      return pathData.chunk.id === pathData.chunk.runtime ? "[name].js" : "[name]/main.js";
    },
  },
  optimization: {
    minimize: false,
    runtimeChunk: {
      name: settings.BUILD_ID,
    },
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
              plugins: [RegisterModuleInjectBuildId, ...webpackBabel.plugins].map((plugin) => {
                if (!Array.isArray(plugin)) {
                  return [plugin, {}, `babel-${plugin.name || plugin}`];
                } else {
                  return [plugin[0], plugin[1], `babel-${plugin[0].name || plugin[0]}`];
                }
              }),
              assumptions: webpackBabel.assumptions,
              cacheDirectory: true,
              sourceMaps: true,
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
        test: /\.json5?$/,
        type: "javascript/auto",
        loader: "json5-loader",
        options: {
          esModule: false,
        },
      },
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.(mp3|png|jpe?g|gif|ico)$/i,
        dependency: { not: ["url"] },
        type: "asset/inline",
      },
      {
        test: /\.css$/i,
        use: (info) => [
          {
            loader: path.resolve(__dirname, "..", "..", "loaders", "EntryCouplingStyleLoader", "compile.js"),
            ident: "EntryCouplingStyleLoader",
            options: {
              getIssuer() {
                return info.issuer;
              },
              getEntryCouplingID(name) {
                return settings.GET_COUPLING_ID(name);
              },
            },
          },
          {
            loader: "css-loader",
            ident: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1,
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
    new ModuleLocalesPlugin(),
    new HTMLWebpackPlugin({
      production: false,
      publicPath: "",
      minify: false,
      inject: false,
      scriptLoading: "defer",
      templateContent: (props) => {
        const entrypoints = [];

        for (const entryPoint of props.compilation.entrypoints.values()) {
          for (const chunk of entryPoint.chunks) {
            if (chunk.name === settings.BUILD_ID) {
              continue;
            }
            entrypoints.push(chunk);
          }
        }

        const headTags = props.htmlWebpackPlugin.tags.headTags
          .filter((item) => !entrypoints.some((chunk) => chunk.files.has(item.attributes.src)))
          .map((item) => {
            if (item.attributes.src === `${settings.BUILD_ID}.js`) {
              item.attributes.src = `/${item.attributes.src}`;
            }
            return item;
          });

        let customManifest;

        try {
          customManifest = JSON.parse(fs.readFileSync(path.resolve(process.env.INIT_CWD, "manifest.json"), "utf8"));
        } catch (_) {
          customManifest = {};
        }

        const implicitManifest = {};

        if (entrypoints.length === 1) {
          implicitManifest.entrypoint = entrypoints[0].id;
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
                    plugins: ["jsx", "typescript"],
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

          implicitManifest.entrypoint = executionOrder[executionOrder.length - 1];
        }

        if (entrypoints.length > 0) {
          implicitManifest.available = entrypoints.map((chunk) => {
            const entry = {
              name: chunk.id,
              program: {
                url: path.join(props.compilation.outputOptions.publicPath, Array.from(chunk.files)[0]),
              },
              locales: {},
              props: {},
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
        }

        const mergedManifest = {};

        if (customManifest.environment) {
          mergedManifest.environment = customManifest.environment;
        }

        if (customManifest.entrypoint) {
          mergedManifest.entrypoint = customManifest.entrypoint;
        } else if (implicitManifest.entrypoint) {
          mergedManifest.entrypoint = implicitManifest.entrypoint;
        }

        if (customManifest.available && implicitManifest.available) {
          mergedManifest.available = customManifest.available;
          for (const entry of implicitManifest.available) {
            mergedManifest.available = mergedManifest.available.filter((existing) => existing.name !== entry.name);
            mergedManifest.available.push(entry);
          }
        } else if (customManifest.available) {
          mergedManifest.available = customManifest.available;
        } else {
          mergedManifest.available = implicitManifest.available;
        }

        return `
            <!DOCTYPE html>
            <html style="margin: 0; width: 100%; height: 100%;">
              <head>
                ${headTags}
              </head>
              <body style="margin: 0; width: 100%; height: 100%;">
                <script defer>
                  (function() {
                    "use strict";

                    const manifest = ${JSON.stringify(mergedManifest).trim()};

                    top.addEventListener("DOMContentLoaded", function() {
                      const react = rocker_so_dependencies("./node_modules/react/index.js");
                      const dom = rocker_so_dependencies("./node_modules/react-dom/client.js");
                      const bootstrap = rocker_so_bootstrap("@rocker/bootstrap/index.js");

                      const root = dom.createRoot(document.getElementById("spa"));
                    
                      root.render(react.createElement(bootstrap.Main, {
                        async fetchContext() {
                          return manifest;
                        }
                      }));
                    })
                  }())
                </script>
                <div id="spa" style="width: 100%; min-height: 100%; display: grid;" />
              </body>
            </html>
          `;
      },
    }),
    new ImplicitDLLAssetPlugin([
      ...dependenciesDlls.map((item) => require.resolve(`@lastui/dependencies/dll/${item}.dll.js`)),
      require.resolve("@lastui/rocker/platform/dll/platform.dll.js"),
      require.resolve("@lastui/rocker/bootstrap/dll/bootstrap.dll.js"),
    ]),
  ],
});
