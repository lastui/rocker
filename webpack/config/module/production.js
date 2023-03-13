const path = require("path");
const webpack = require("webpack");

const ModuleLocalesPlugin = require("../../plugins/ModuleLocalesPlugin");
const RegisterModuleInjectBuildId = require("../../../babel/plugins/RegisterModuleInjectBuildId");
const NormalizedModuleIdPlugin = require("../../plugins/NormalizedModuleIdPlugin");

const settings = require("../../settings");

const babel = require("../../../babel").env.production;

const config = {
  ...require("../../internal/base.js"),
  ...require("../../internal/build.js"),
};

config.output.clean = {
  keep(asset) {
    for (const entry in config.entry) {
      if (asset.startsWith(`module/${entry}`)) {
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
    test: /\.(png|jpg|gif)$/i,
    type: "asset/inline",
  },
);

config.plugins.push(
  new ModuleLocalesPlugin({
    from: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "..", "dependencies", "dll", "dependencies-prod-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "platform", "dll", "platform-prod-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "..", "..", "..", "bootstrap", "dll", "bootstrap-prod-manifest.json"),
    sourceType: "var",
    context: settings.PROJECT_ROOT_PATH,
  }),
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
  new NormalizedModuleIdPlugin(),
);

module.exports = config;