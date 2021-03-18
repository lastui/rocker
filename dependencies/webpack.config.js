const path = require("path");

const settings = require("../webpack/settings");

const manifest = require("./node_modules/@lastui/dependencies/package.json");

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
	],
};

module.exports = config;
