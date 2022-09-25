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
          compilation.chunkGraph.setModuleId(item, id.replace(/\/(dist|esm?|cjs|lib|unpkg)\//g, "/"));
        }
      });
    });
  }
}

NormalizedModuleIdPlugin.name = "NormalizedModuleIdPlugin";

module.exports = NormalizedModuleIdPlugin;