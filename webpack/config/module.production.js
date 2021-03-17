const path = require("path");
const webpack = require("webpack");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/build.js"),
};

config.output.filename = '[name].min.js';

config.plugins.push(
	...[
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				"../../dependencies/dll/dependencies-prod-manifest.json"
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				"../../platform/dll/platform-prod-manifest.json"
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
	]
);

module.exports = config;
