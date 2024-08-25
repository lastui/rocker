const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

class ImplicitDLLAssetPlugin {
  constructor(assets = []) {
    this.assets = assets;
    this.addedAssets = [];
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ImplicitDLLAssetPlugin.name, (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.beforeAssetTagGeneration.tapPromise(ImplicitDLLAssetPlugin.name, async (htmlPluginData) => {
        for (const asset of this.assets) {
          const resolvedFilename = path.resolve(compilation.compiler.context, asset);

          const basename = path.basename(resolvedFilename);

          compilation.fileDependencies.add(resolvedFilename);
          if (!compilation.getAsset(basename)) {
            const content = await new Promise((resolve, reject) => {
              fs.readFile(resolvedFilename, "utf8", (read_err, read_ok) => {
                if (!read_err) {
                  resolve(read_ok);
                } else {
                  reject(read_err);
                }
                return;
              });
            });

            const source = new compiler.webpack.sources.RawSource(content, true);

            compilation.emitAsset(basename, source);
          }

          const fullPath =
            compilation.outputOptions.publicPath +
            compilation.outputOptions.chunkFilename.slice(0, compilation.outputOptions.chunkFilename.length - 13) +
            basename;

          htmlPluginData.assets.js.unshift(fullPath);

          compilation.assets[fullPath] = compilation.assets[basename];
          delete compilation.assets[basename];

          this.addedAssets.push(fullPath);
        }
      });

      hooks.alterAssetTags.tap(ImplicitDLLAssetPlugin.name, (htmlPluginData) => {
        for (const script of htmlPluginData.assetTags.scripts) {
          if (!this.addedAssets.includes(script.attributes.src)) {
            continue;
          }
          script.attributes.defer = true;
        }
      });
    });
  }
}

ImplicitDLLAssetPlugin.name = "ImplicitDLLAssetPlugin";

module.exports = ImplicitDLLAssetPlugin;
