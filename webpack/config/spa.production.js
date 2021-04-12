const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/build.js"),
};

config.output.filename = "[name].js";
config.output.assetModuleFilename = "[name][ext][query]";

config.module.rules.push(
	{
		test: /\.css$/i,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
			},
			{
				loader: "css-loader",
				options: {
					sourceMap: false,
					importLoaders: 1,
				},
			},
		],
	},
	{
		test: /\.s[a|c]ss$/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
			},
			{
				loader: "css-loader",
				options: {
					sourceMap: false,
					importLoaders: 1,
				},
			},
			{
				loader: "sass-loader",
				options: {
					implementation: require("sass"),
					sassOptions: {
						fiber: false,
					},
					sourceMap: false,
				},
			},
		],
	},
	{
		test: /\.(woff|woff2|eot|otf|ttf|png|jpg|gif)(\?.*$|$)/,
		type: "asset/resource",
	}
);

config.plugins.push(
	new MiniCssExtractPlugin({
		filename: "[name].css",
		chunkFilename: "[id].css",
		linkType: "text/css",
		ignoreOrder: false,
	}),
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
	}),
	new HTMLWebpackPlugin({
		template: path.resolve(settings.PROJECT_ROOT_PATH, "static/index.html"),
		production: true,
		publicPath: settings.PROJECT_NAMESPACE,
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
	])
);

module.exports = config;