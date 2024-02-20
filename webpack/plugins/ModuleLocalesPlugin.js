const fs = require("fs");
const path = require("path");

const settings = require("../settings");

async function ensureFile(filename, reject, resolve) {
  fs.stat(filename, (stat_err, _stat) => {
    if (stat_err === null) {
      resolve(true);
    } else if (stat_err.code === "ENOENT") {
      fs.mkdir(path.dirname(filename), (mkdir_err) => {
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
}

class ModuleLocalesPlugin {
  constructor() {
    this.paths_to_watch = [];
    for (const language of settings.SUPPORTED_LOCALES) {
      this.paths_to_watch.push(`${language}.json`);
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

          const assetsToWatch = [];

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

            const hasRuntimeChunk = entryPoint.chunks.length > 1;

            for (const chunk of entryPoint.chunks) {
              if (hasRuntimeChunk && chunk.id === chunk.runtime) {
                continue;
              }

              for (const asset of this.paths_to_watch) {
                const outputPath = path.join(assetOutputDirectory, chunk.id, "messages", asset);
                if (compilation.getAsset(outputPath)) {
                  continue;
                }
                const inputPath = path.resolve(entryPointOrigin, asset);
                assetsToWatch.push([inputPath, outputPath]);
              }
            }
          }

          for (const [inputPath, outputPath] of assetsToWatch) {
            try {
              const content = await new Promise((resolve, reject) => {
                fs.readFile(inputPath, "utf8", (read_err, read_ok) => {
                  if (!read_err) {
                    resolve(read_ok);
                    return;
                  }
                  ensureFile(inputPath, (ensure_err, _ensure_ok) => {
                    if (ensure_err) {
                      reject(ensure_err);
                      return;
                    }
                    fs.writeFile(inputPath, "{}", (write_err, _write_ok) => {
                      if (write_err) {
                        reject(write_err);
                        return;
                      }
                      resolve("{}");
                    });
                  });
                });
              });
              compilation.fileDependencies.add(inputPath);
              compilation.emitAsset(outputPath, new compiler.webpack.sources.RawSource(content));
            } catch (error) {
              console.error("Failed to process locale asset", inputPath, "with error", error);
            }
          }
        },
      );
    });
  }
}

ModuleLocalesPlugin.name = "ModuleLocalesPlugin";

module.exports = ModuleLocalesPlugin;
