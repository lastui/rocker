class NormalizedModuleIdPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(NormalizedModuleIdPlugin.name, (compilation) => {
      compilation.hooks.beforeModuleIds.tap(NormalizedModuleIdPlugin.name, (modules) => {
        for (const item of modules) {
          if (!item.libIdent) {
            continue;
          }
          const id = item.libIdent({ context: compiler.options.context });
          if (!id) {
            continue;
          }
          compilation.chunkGraph.setModuleId(
            item,
            id.startsWith("./node_modules/@lastui/rocker")
              ? id.replace(/.\/node_modules\/@lastui\/rocker/g, "@rocker")
              : id.replace(/\/(dist|esm?|cjs|lib|unpkg)\//g, "/").replace(/\.m?js$/g, ".js"),
          );
        }
      });
    });
  }
}

NormalizedModuleIdPlugin.name = "NormalizedModuleIdPlugin";

module.exports = NormalizedModuleIdPlugin;
