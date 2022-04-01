const path = require("path");
const settings = require("../webpack/settings");

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	dependencies: [
		// essentials
		"history",
		"react",
		"regenerator-runtime/runtime.js",
		"react/jsx-runtime.js",
		"react-dom",
		"react-intl",
		"react-redux",
		"redux",
		"redux-saga",
		"redux-saga/effects",
		// css-in-js
		"linaria",
		"@linaria/react",
		"@linaria/core",
	],
};

module.exports = config;