const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/build.js"),
};

config.output.filename = "[name].js";

config.module.rules.push(
	{
		test: /\.css$/i,
		use: [
			{
                loader: "file-loader",
                options: {
                    name: "[name].css",
                },
            },
			"extract-loader",
			"css-loader",
		],
	},
	{
		test: /\.scss$/,
		use: [
			{
                loader: "file-loader",
                options: {
                    name: "[name].css",
                },
            },
			"extract-loader",
			"css-loader",
			"sass-loader",
		],
	},
)

config.plugins.push(
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
	}),
	new HTMLWebpackPlugin({
		template: path.resolve(
			settings.PROJECT_ROOT_PATH,
			"static/index.html"
		),
		production: true,
		publicPath: "/",
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeRedundandAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeStyleLinkTypeAttributes: false,
			keepClosingSlash: true,
			minifyJS: false,
			minofyCSS: false,
			minifyURLs: false,
		},
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
		{
			filepath: path.resolve(
				__dirname,
				"../../runtime/dll/runtime.dll.min.js"
			),
			typeOfAsset: "js",
		},
	]),
);

module.exports = config;
