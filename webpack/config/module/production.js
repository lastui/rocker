const path = require("path");
const webpack = require("webpack");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const dependenciesDlls = require("@lastui/dependencies");

const babel = require("../../../babel");
const RegisterModuleInjectBuildId = require("../../../babel/plugins/RegisterModuleInjectBuildId");
const ModuleLocalesPlugin = require("../../plugins/ModuleLocalesPlugin");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");
const settings = require("../../settings");

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

const webpackBabel = babel.env.production;
const linariaBabel = babel.env.test;

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
          plugins: [RegisterModuleInjectBuildId, ...webpackBabel.plugins].map((plugin) => {
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
    test: /\.(png|jpg|gif)$/i,
    type: "asset/inline",
  },
);

config.plugins.push(
  new ModuleLocalesPlugin(),
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
  new NormalizedModuleIdPlugin(),
  new StatsWriterPlugin({
    filename: path.join("..", "reports", "sbom.json"),
    stats: {
      assets: false,
      dependentModules: true,
    },
    async transform(data) {
      const shared = require("@lastui/dependencies/sbom.json");

      const lockfile = require(
        path.resolve(require.resolve("@lastui/dependencies"), "..", "..", "..", "..", "package-lock.json"),
      );

      const candidates = [];

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
