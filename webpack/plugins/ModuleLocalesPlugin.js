const settings = require("../settings");
const fs = require('fs');
const path = require('path');

class ModuleLocalesPlugin {
  
  constructor() {
    this.messagesPath = path.resolve(settings.PROJECT_ROOT_PATH, "messages.json");
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
          let content;
          try {
            content = fs.readFileSync(this.messagesPath, "utf8");
          } catch (_) {
            content = JSON.stringify(this.defaultMessages, null, 4)
            fs.writeFileSync(this.messagesPath, content);
          }
          compilation.emitAsset('messages.json', new compiler.webpack.sources.RawSource(JSON.stringify(JSON.parse(content))));
          compilation.fileDependencies.add(this.messagesPath)
        }
      );
    });
  }
}

module.exports = ModuleLocalesPlugin;
