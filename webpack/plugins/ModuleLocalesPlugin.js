const fs = require("fs");
const path = require("path");

const settings = require("../settings");

class ModuleLocalesPlugin {
  constructor(options) {
    this.from = options.from;
    this.paths_to_watch = [];
    for (const language of settings.SUPPORTED_LOCALES) {
      this.paths_to_watch.push(`${language}.json`);
    }
  }

  async ensureAsset(filename) {
    try {
      return await fs.promises.readFile(filename, "utf8");
    } catch (_error) {
      await new Promise((resolve, reject) => {
        const parent = path.dirname(filename);
        fs.stat(parent, (stat_err, _stat) => {
          if (stat_err === null) {
            resolve(true);
          } else if (stat_err.code === "ENOENT") {
            fs.mkdir(parent, (mkdir_err) => {
              if (mkdir_err && mkdir_err.code !== "EEXIST") {
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
      await fs.promises.writeFile(filename, "{}");
      return "{}";
    }
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ModuleLocalesPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: ModuleLocalesPlugin.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async (_assets) => {
          const assetOutputDirectory = path.dirname(compilation.outputOptions.assetModuleFilename);

          for (const entryPoint of compilation.entrypoints.values()) {
            let entryPointOrigin = null;

            for (const origin of entryPoint.origins) {
              if (origin.request.indexOf("core-js/") !== -1) {
                continue;
              }
              if (origin.request.endsWith("tslib/tslib.es6.js")) {
                continue;
              }
              if (origin.request.indexOf("regenerator-runtime/") !== -1) {
                continue;
              }
              if (origin.request.indexOf("webpack") !== -1) {
                continue;
              }
              entryPointOrigin = path.extname(origin.request)
                ? path.resolve(origin.request, "..", "..", "messages")
                : path.resolve(origin.request, "..", "messages");
              break;
            }

            for (const chunk of entryPoint.chunks) {
              if (chunk.id === chunk.runtime) {
                continue;
              }

              for (const asset of this.paths_to_watch) {
                const outputPath = path.join(assetOutputDirectory, chunk.id, "messages", asset);
                if (compilation.getAsset(outputPath)) {
                  continue;
                }

                const inputPath = path.resolve(entryPointOrigin, asset);
                try {
                  const content = await this.ensureAsset(inputPath);
                  compilation.fileDependencies.add(inputPath);
                  compilation.emitAsset(outputPath, new compiler.webpack.sources.RawSource(content));
                } catch (error) {
                  console.error("Failed to process locale asset", inputPath, "with error", error);
                }
              }
            }
          }
        },
      );
    });
  }
}

ModuleLocalesPlugin.name = "ModuleLocalesPlugin";

module.exports = ModuleLocalesPlugin;
