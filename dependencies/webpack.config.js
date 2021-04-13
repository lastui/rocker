const path = require("path");
const settings = require("../webpack/settings");

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	dependencies: [
		"react",
		"react-dom",
		"react-intl",
		"react-redux",
		"react-router",
		"react-router-dom",
		"redux",
		"redux-saga",
		"redux-saga/effects",
		"regenerator-runtime/runtime.js",
		"styled-components",
	],
};

module.exports = config;