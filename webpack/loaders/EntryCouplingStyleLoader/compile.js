const path = require('path');

function loader(content) {
  return content;
}

loader.pitch = function(request) {
  const options = this.getOptions();

  let max = 0;
  let candidate = null;

  const file = request.slice(request.lastIndexOf("!") + 1);

  // TODO two passes firstly remove common prefix from all 

  // TODO INFO possibility of false positive when using common node_modules outside of entrypoint which would falsely associate it
  // to random entrypoint
  for (const entry of this._compilation.entries) {
    let idx = 0;

    for (const entryFile of entry[1].dependencies) {
      while (entryFile.request[idx] === file[idx]) {
        idx++;
      }
    }

    if (idx > max) {
      max = idx;
      candidate = entry;
    }
  }

  if (!candidate) {
    return "";
  }

  const thisBuild = options.getEntryCouplingID();
  const guid = options.getEntryCouplingID(candidate[0]);

  return `
const css = require(${JSON.stringify(this.utils.contextify(this.context, `!!${request}`))});
const load = require(${JSON.stringify(this.utils.contextify(this.context, path.join(__dirname, "runtime.js")))});
load(css, '${guid.startsWith(thisBuild + '-') ? guid.slice(thisBuild.length + 1) : guid}');
  `;
};

module.exports = loader;
