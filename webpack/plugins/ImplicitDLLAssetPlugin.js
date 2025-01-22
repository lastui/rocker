const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

class ImplicitDLLAssetPlugin {
  constructor(assets = []) {
    this.assets = assets;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ImplicitDLLAssetPlugin.name, (compilation) => {
      const { beforeAssetTagGeneration } = HtmlWebpackPlugin.getHooks(compilation);

      beforeAssetTagGeneration.tap(ImplicitDLLAssetPlugin.name, (htmlPluginData) => {
        for (const asset of this.assets) {
          const resolvedFilename = path.resolve(compilation.compiler.context, asset);

          const fullPath = compilation.outputOptions.chunkFilename.replace(
            /\[(name|id)\]/g,
            path.basename(resolvedFilename).replace(/(?:\.min)?\.js/g, ""),
          );

          if (compilation.getAsset(fullPath)) {
            continue;
          }

          const buffer = compiler.inputFileSystem.readFileSync(resolvedFilename);

          compilation.emitAsset(fullPath, new compiler.webpack.sources.RawSource(buffer, false));

          htmlPluginData.assets.js.unshift(compilation.outputOptions.publicPath + fullPath);
        }
      });
    });
  }
}

ImplicitDLLAssetPlugin.name = "ImplicitDLLAssetPlugin";

module.exports = ImplicitDLLAssetPlugin;
