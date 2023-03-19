const path = require("path");
const { ensureDirectory, copyFile } = require("../../helpers/io");

module.exports = async function () {
  const node_modules = path.join(require.resolve("eslint").split("node_modules")[0], "node_modules");

  const target = path.join(node_modules, "eslint-plugin-rockerlog", "index.js");

  await ensureDirectory(path.dirname(target));
  await copyFile(path.resolve(__dirname, "logger.js"), target);
};
