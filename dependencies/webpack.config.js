const path = require("path");
const settings = require("../webpack/settings");

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	dependencies: [
		"connected-react-router",
		"history",
		"object-assign",
		"react",
		"react-dom",
		"react-intl",
		"react-redux",
		"react-router",
		"react-router-dom",
		"redux",
		"redux-saga",
		"redux-saga/effects",
		"resolve-pathname",
		"value-equal",
		"warning",
		"regenerator-runtime/runtime.js",
	],
};

module.exports = config;