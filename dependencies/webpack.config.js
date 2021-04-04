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
		"css-loader/dist/runtime/api.js",
		"style-loader/dist/runtime/injectStylesIntoLinkTag",
		"style-loader/dist/runtime/injectStylesIntoStyleTag",
		"style-loader/dist/runtime/isEqualLocals",
	],
};

module.exports = config;
