const settings = require("../settings");
const fs = require("fs");
const path = require("path");

class ModuleLocalesPlugin {
  constructor(options) {
    this.paths_to_watch = [];
    for (const language of settings.SUPPORTED_LOCALES) {
      this.paths_to_watch.push(path.resolve(options.from, `${language}.json`));
    }
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ModuleLocalesPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: ModuleLocalesPlugin.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (_assets) => {
          const outputPath = path.dirname(compilation.outputOptions.assetModuleFilename);

          for (const asset of this.paths_to_watch) {
            fs.promises
              .readFile(asset, "utf8")
              .catch(async () => {
                await new Promise((resolve, reject) => {
                  const parent = path.dirname(asset);
                  fs.stat(parent, (stat_err, _stat) => {
                    if (stat_err === null) {
                      resolve(true);
                    } else if (stat_err.code === "ENOENT") {
                      resolve(true);
                      fs.mkdir(parent, (mkdir_err) => {
                        if (mkdir_err) {
                          reject(mkdir_err);
                        } else {
                          resolve(true);
                        }
                      });
                    } else {
                      reject(stat_err);
                    }
                  });
                });
                const content = "{}";
                await fs.promises.writeFile(asset, content);
                return content;
              })
              .then((content) => {
                const target = path.join(outputPath, 'messages', path.basename(asset))
                compilation.fileDependencies.add(asset);
                if (!compilation.getAsset(target)) {
                  compilation.emitAsset(target, new compiler.webpack.sources.RawSource(content));
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        },
      );
    });
  }
}

module.exports = ModuleLocalesPlugin;