const path = require("path");

module.exports = {
  process(src, filename) {
    if (filename === undefined) {
      return "module.exports = undefined;";
    }
    return `module.exports = "${path.basename(filename)}";`;
  },
};