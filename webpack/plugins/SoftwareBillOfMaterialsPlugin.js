const path = require("path");

const DEFAULT_FILENAME = (_entrypoint) => "sbom/report.json";
const DEFAULT_OMIT = (_dependency) => false;

class SoftwareBillOfMaterialsPlugin {
  constructor(options = {}) {
    this.options = {};
    this.options.filename = options.filename ?? DEFAULT_FILENAME;
    this.options.omit = options.omit ?? DEFAULT_OMIT;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(SoftwareBillOfMaterialsPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: SoftwareBillOfMaterialsPlugin.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async () => {
          const stats = compilation.getStats().toJson({
            assets: true,
            dependentModules: true,
          });

          const shared = require("@lastui/dependencies/sbom.json");

          const lockfile = require(
            path.resolve(require.resolve("@lastui/dependencies"), "..", "..", "..", "..", "package-lock.json"),
          );

          for (const entrypoint in stats.namedChunkGroups) {
            const candidates = [];

            for (const asset of stats.assets) {
              if (!asset.info.sourceFilename) {
                continue;
              }
              if (!asset.info.sourceFilename.startsWith("node_modules/")) {
                continue;
              }
              if (candidates.indexOf("./" + asset.info.sourceFilename) === -1) {
                candidates.push("./" + asset.info.sourceFilename);
              }
            }

            for (const chunk of stats.chunks) {
              if (chunk.id !== entrypoint) {
                continue;
              }

              for (const entry of chunk.modules) {
                if (entry.moduleType === "asset/inline") {
                  if (!entry.id.startsWith("./node_modules/")) {
                    continue;
                  }
                  if (candidates.indexOf(entry.id) === -1) {
                    candidates.push(entry.id);
                  }
                } else {
                  for (const reason of entry.reasons) {
                    if (!reason.resolvedModuleId) {
                      continue;
                    }
                    let moduleId = reason.resolvedModuleId;
                    if (moduleId.startsWith("@rocker/")) {
                      moduleId = "./node_modules/@lastui/rocker";
                    }
                    if (!moduleId.startsWith("./node_modules/")) {
                      continue;
                    }
                    if (candidates.indexOf(moduleId) === -1) {
                      candidates.push(moduleId);
                    }
                  }
                }
              }
            }

            const report = {};

            for (const candidate of candidates) {
              const parts = candidate.substring(15).split("/");
              const item = candidate[15] === "@" ? parts[0] + "/" + parts[1] : parts[0];

              if (item in shared) {
                continue;
              }

              report[item] = "*";
            }

            for (const item in report) {
              if (item.startsWith("@lastui/") || this.options.omit(item)) {
                delete report[item];
                continue;
              }
              const entry = lockfile.packages["node_modules/" + item];
              if (!entry) {
                delete report[item];
                continue;
              }
              report[item] = entry.version;
            }

            if (!this.options.omit("@lastui/dependencies")) {
              Object.assign(report, shared);
            }

            const outputPath = path.join("..", "reports", this.options.filename(entrypoint));

            const asset = compilation.getAsset(outputPath);
            if (asset) {
              compilation.updateAsset(outputPath, new compiler.webpack.sources.RawSource(JSON.stringify(report, null, 2)));
            } else {
              compilation.emitAsset(outputPath, new compiler.webpack.sources.RawSource(JSON.stringify(report, null, 2)));
            }
          }
        },
      );
    });
  }
}

SoftwareBillOfMaterialsPlugin.name = "SoftwareBillOfMaterialsPlugin";

module.exports = SoftwareBillOfMaterialsPlugin;
