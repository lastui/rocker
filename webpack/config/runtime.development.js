const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/development.js"),
};

config.output.filename = '[name].[fullhash].js';

config.plugins.push(
	...[
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				"../../dependencies/dll/dependencies-dev-manifest.json"
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				"../../platform/dll/platform-dev-manifest.json"
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
		new HTMLWebpackPlugin({
			template: path.resolve(
				settings.PROJECT_ROOT_PATH,
				"static/index.html"
			),
			production: false,
			publicPath: "/",
			minify: false,
			inject: "body",
			scriptLoading: "blocking",
		}),
		new AddAssetHtmlPlugin([
			{
				filepath: path.resolve(
					__dirname,
					"../../dependencies/dll/dependencies.dll.min.js"
				),
				typeOfAsset: "js",
			},
			{
				filepath: path.resolve(
					__dirname,
					"../../platform/dll/platform.dll.min.js"
				),
				typeOfAsset: "js",
			},
		]),
	]
);

module.exports = config;
