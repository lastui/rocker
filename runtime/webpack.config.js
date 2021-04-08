const { execSync } = require("child_process");
const path = require("path");
const webpack = require("webpack");
const settings = require("../webpack/settings");
const cwd = path.resolve(process.cwd());

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	runtime: ["@lastui/rocker/runtime"],
};

config.plugins.push(
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			`../dependencies/dll/dependencies-${
				settings.DEVELOPMENT ? "dev" : "prod"
			}-manifest.json`
		),
		context: settings.PROJECT_ROOT_PATH,
	}),
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			`../platform/dll/platform-${
				settings.DEVELOPMENT ? "dev" : "prod"
			}-manifest.json`
		),
		context: settings.PROJECT_ROOT_PATH,
	})
);

module.exports = config;
