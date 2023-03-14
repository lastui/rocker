const path = require("path");

module.exports = {
  process(src, filename) {
    if (filename === undefined) {
      return {
        code: "module.exports = undefined;",
      };
    }
    return {
      code: `module.exports = "${path.basename(filename)}";`,
    };
  },
};
