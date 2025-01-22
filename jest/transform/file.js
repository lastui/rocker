module.exports = {
  process(src, filename) {
    if (filename === undefined) {
      return {
        code: "module.exports = undefined;",
      };
    }
    return {
      code: `module.exports = "${src}<->${filename}";`,
    };
  },
};
