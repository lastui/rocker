const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

class ImplicitDLLAssetPlugin {
  constructor(assets = []) {
    this.assets = assets;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ImplicitDLLAssetPlugin.name, (compilation) => {
      const { beforeAssetTagGeneration, alterAssetTags } = HtmlWebpackPlugin.getHooks(compilation);

      const addedAssets = [];

      beforeAssetTagGeneration.tap(ImplicitDLLAssetPlugin.name, (htmlPluginData) => {
        for (const asset of this.assets) {
          const resolvedFilename = path.resolve(compilation.compiler.context, asset);

          const basename = path.basename(resolvedFilename);

          if (compilation.getAsset(basename)) {
            continue;
          }

          const buffer = compiler.inputFileSystem.readFileSync(resolvedFilename);

          compilation.emitAsset(basename, new compiler.webpack.sources.RawSource(buffer, false));

          const fullPath =
            compilation.outputOptions.publicPath +
            compilation.outputOptions.chunkFilename.replace(/\[(name|id)\]/g, basename.replace(/(?:\.min)?\.js/g, ""));

          htmlPluginData.assets.js.unshift(fullPath);

          compilation.assets[fullPath] = compilation.assets[basename];
          delete compilation.assets[basename];

          addedAssets.push(fullPath);
        }
      });

      alterAssetTags.tap(ImplicitDLLAssetPlugin.name, (htmlPluginData) => {
        for (const script of htmlPluginData.assetTags.scripts) {
          if (!addedAssets.includes(script.attributes.src)) {
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
