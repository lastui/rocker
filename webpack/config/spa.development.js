const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/development.js"),
};

config.output.filename = "[name].[fullhash].js";

config.module.rules.push(
	{
		test: /\.css$/i,
		use: [
			{
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
				},
			},
			"css-loader",
		],
	},
	{
		test: /\.s[a|c]ss$/,
		use: [
			{
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
				},
			},
			"css-loader",
			"sass-loader",
		],
	},
	{
		test: /\.(png|jpg|gif)$/i,
		dependency: { not: ["url"] },
		type: "asset/inline",
	},
	{
		test: /\.(woff|woff2|eot|otf|ttf)(\?.*$|$)/,
		type: "asset/resource",
	}
);

config.plugins.push(
	new WebpackPluginServe({
		hmr: false,
		historyFallback: true,
		host: "0.0.0.0",
		port: settings.DEV_SERVER_PORT,
		status: true,
		ramdisk: false,
		liveReload: true,
		waitForBuild: true,
		log: {
			level: settings.LOG_LEVEL,
		},
		static: settings.PROJECT_DEV_PATH,
		client: {
			silent: false,
		},
	}),
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
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../runtime/dll/runtime-dev-manifest.json"
		),
		context: settings.PROJECT_ROOT_PATH,
	}),
	new HTMLWebpackPlugin({
		template: path.resolve(settings.PROJECT_ROOT_PATH, "static/index.html"),
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
				"../../dependencies/dll/dependencies.dll.js"
			),
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../platform/dll/platform.dll.js"
			),
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../runtime/dll/runtime.dll.js"
			),
			typeOfAsset: "js",
		},
	])
);

module.exports = config;
