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

          const basename = path.basename(resolvedFilename);

          if (compilation.getAsset(basename)) {
            continue;
          }

          const buffer = compiler.inputFileSystem.readFileSync(resolvedFilename);

          compilation.emitAsset(basename, new compiler.webpack.sources.RawSource(buffer, false));

          const fullPath =
            compilation.outputOptions.chunkFilename.replace(/\[(name|id)\]/g, basename.replace(/(?:\.min)?\.js/g, ""));

          htmlPluginData.assets.js.unshift(compilation.outputOptions.publicPath + fullPath);

          compilation.assets[fullPath] = compilation.assets[basename];
          delete compilation.assets[basename];
        }
      });
    });
  }
}

ImplicitDLLAssetPlugin.name = "ImplicitDLLAssetPlugin";

module.exports = ImplicitDLLAssetPlugin;
