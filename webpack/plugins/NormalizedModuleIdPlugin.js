class NormalizedModuleIdPlugin {
  constructor() {
    this.volatileDir = new RegExp(/\/(dist|esm?|cjs|lib|unpkg)\//);
    this.volatileExt = new RegExp(/\.(esm\.|cjs\.|m)js$/);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(NormalizedModuleIdPlugin.name, (compilation) => {
      compilation.hooks.beforeModuleIds.tap(NormalizedModuleIdPlugin.name, (modules) => {
        for (const item of modules) {
          if (!item.libIdent) {
            continue;
          }

          const id = item.libIdent({ context: compiler.options.context });
          if (!id || id.startsWith("dll-reference")) {
            continue;
          }

          compilation.chunkGraph.setModuleId(
            item,
            id.startsWith("./node_modules/@lastui/rocker/")
              ? "@" + id.substr(23)
              : id.replace(this.volatileDir, "/").replace(this.volatileExt, ".js"),
          );
        }
      });
    });
  }
}

NormalizedModuleIdPlugin.name = "NormalizedModuleIdPlugin";

module.exports = NormalizedModuleIdPlugin;
