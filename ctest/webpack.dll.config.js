const path = require("path");
const settings = require("../webpack/settings");
const manifest = require("./node_modules/@lastui/dependencies/package.json");

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	dependencies: Object.keys(manifest.dependencies),
};

module.exports = config;
