const settings = require("../settings");
const fs = require('fs');
const path = require('path');

class ModuleLocalesPlugin {
  
  constructor() {
    this.defaultMessages = {
      "en-US": {}
    }
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ModuleLocalesPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: ModuleLocalesPlugin.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (_assets) => {
          for (const language of this.defaultMessages) {
            const messagesPath = path.resolve(settings.PROJECT_ROOT_PATH, "messages", `${language}.json`);
            let content;
            try {
              content = fs.readFileSync(messagesPath, "utf8");
            } catch (_) {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir);
              }
              content = "{}"
              fs.writeFileSync(messagesPath, content);
            }
            compilation.emitAsset(`messages/${language}.json`, new compiler.webpack.sources.RawSource(JSON.stringify(JSON.parse(content))));
            compilation.fileDependencies.add(messagesPath)
          }
        }
      );
    });
  }
}

module.exports = ModuleLocalesPlugin;
