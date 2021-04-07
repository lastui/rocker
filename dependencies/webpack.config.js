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
		"loose-envify",
		"object-assign",
		"react",
		"react-dom",
		"react-redux",
		"react-router",
		"react-router-dom",
		"redux",
		"redux-saga",
		"redux-saga/effects",
		"@babel/runtime/regenerator",
	],
};

module.exports = config;