const settings = require("../settings");
const fs = require("fs");
const path = require("path");

class ModuleLocalesPlugin {

  constructor() {
    this.paths_to_watch = {}
    for (const language of settings.SUPPORTED_LOCALES) {
      this.paths_to_watch[`messages/${language}.json`] =
        path.resolve(settings.PROJECT_ROOT_PATH, "messages", `${language}.json`);
    }
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      ModuleLocalesPlugin.name,
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: ModuleLocalesPlugin.name,
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          (_assets) => {
            for (const [name, asset] of Object.entries(this.paths_to_watch)) {
              fs.promises.readFile(asset, "utf8")
                .catch(async () => {
                  await new Promise((resolve, reject) => {
                    const parent = path.dirname(asset);
                    fs.stat(parent, (stat_err, stat) => {
                      if (stat_err === null) {
                        resolve(true)
                      } else if (stat_err.code === 'ENOENT') {
                        resolve(true)
                        fs.mkdir(parent, (mkdir_err) => {
                          if (mkdir_err) {
                            reject(mkdir_err)
                          } else {
                            resolve(true)
                          }
                        })
                      } else {
                        reject(stat_err)
                      }
                    })
                  })
                  const content = "{}";
                  await fs.promises.writeFile(asset, content);
                  return content
                })
                .then((content) => {
                  compilation.fileDependencies.add(asset);
                  compilation.emitAsset(name, new compiler.webpack.sources.RawSource(content));
                }).catch((err) => {
                  console.error(err)
                })
            }
          }
        );
      }
    );
  }
}

module.exports = ModuleLocalesPlugin;
