const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/build.js"),
};

config.output.filename = "[name].min.js";

config.module.rules.push(
	{
		test: /\.css$/i,
		use: ["style-loader", "css-loader"],
	},
	{
		test: /\.s[a|c]ss$/,
		use: ["style-loader", "css-loader", "sass-loader"],
	},
	{
		test: /\.(png|jpg|gif)$/i,
		dependency: { not: ["url"] },
		type: "asset/inline",
	}
);

config.plugins.push(
	new CleanWebpackPlugin({
		root: settings.PROJECT_BUILD_PATH,
		cleanOnceBeforeBuildPatterns: ["**/*"],
		cleanStaleWebpackAssets: true,
		dangerouslyAllowCleanPatternsOutsideProject: false,
		verbose: false,
		dry: false,
	}),
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
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../runtime/dll/runtime-prod-manifest.json"
		),
		context: settings.PROJECT_ROOT_PATH,
	})
);

module.exports = config;