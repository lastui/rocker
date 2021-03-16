const path = require("path");
const { Config } = require("webpack-config");

const settings = require(path.resolve(__dirname, "../settings"));

module.exports = new Config().extend(
	path.join(settings.WEBPACK_ROOT_PATH, "internal/base.js"),
	path.join(settings.WEBPACK_ROOT_PATH, "internal/loaders.js"),
	path.join(settings.WEBPACK_ROOT_PATH, "internal/build.js"),
	path.join(settings.WEBPACK_ROOT_PATH, "internal/dll.js")
);
