const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/build.js"),
};

config.output = {
	path: settings.DLL_BUILD_PATH,
	filename: `[name].dll${settings.DEVELOPMENT ? "" : ".min"}.js`,
	library: "[name]_dll",
};

config.plugins.push(
	new CleanWebpackPlugin({
		root: settings.PROJECT_ROOT_PATH,
		cleanOnceBeforeBuildPatterns: [
			path.join(
				settings.DLL_BUILD_PATH,
				`[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`
			),
			path.join(
				settings.DLL_BUILD_PATH,
				`[name].dll${settings.DEVELOPMENT ? "" : ".min"}.js`
			),
		],
		verbose: false,
		dry: false,
	}),
	new webpack.DllPlugin({
		context: settings.PROJECT_ROOT_PATH,
		path: path.join(
			settings.DLL_BUILD_PATH,
			`[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`
		),
		name: "[name]_dll",
	})
);

module.exports = config;