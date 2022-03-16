const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const settings = require("../settings");

const babel = require("@lastui/babylon").env.production;

const config = {
	...require("../internal/base.js"),
	...require("../internal/build.js"),
};

config.output.filename = "spa/[name].min.js";
config.output.assetModuleFilename = "spa/[name][ext][query]";

config.module.rules.push(
	{
		test: /\.[j|t]sx?$/,
		enforce: "pre",
		include: [settings.PROJECT_SRC_PATH, /node_modules\/\@lastui*/],
		exclude: [/node_modules\/(?!(\@lastui*))/],
		use: [
			{
				loader: "babel-loader",
				options: {
					babelrc: false,
					presets: babel.presets.map((preset) => {
						if (typeof preset === "string") {
							return [preset, {}, `babel-${preset}`];
						} else {
							return [preset[0], preset[1], `babel-${preset[2]}`];
						}
					}),
					plugins: babel.plugins.map((plugin) => {
						if (typeof plugin === "string") {
							return [plugin, {}, `babel-${plugin}`];
						} else {
							return [plugin[0], plugin[1], `babel-${plugin[2]}`];
						}
					}),
					sourceMaps: false,
					sourceType: "module",
					highlightCode: true,
					shouldPrintComment: (val) => /license/.test(val),
					compact: true,
					inputSourceMap: false,
				},
			},
			{
				loader: "@linaria/webpack-loader",
				options: {
					sourceMap: false,
					preprocessor: "stylis",
					cacheDirectory: path.join(
						settings.WEBPACK_ROOT_PATH,
						".linaria-cache"
					),
					classNameSlug: (hash, title) =>
						`${settings.PROJECT_NAME}__${title}__${hash}`,
					babelOptions: {
						babelrc: false,
						presets: babel.presets.map((preset) => {
							if (typeof preset === "string") {
								return [preset, {}, `linaria-${preset}`];
							} else {
								return [
									preset[0],
									preset[1],
									`linaria-${preset[2]}`,
								];
							}
						}),
						plugins: babel.plugins.map((plugin) => {
							if (typeof plugin === "string") {
								return [plugin, {}, `linaria-${plugin}`];
							} else {
								return [
									plugin[0],
									plugin[1],
									`linaria-${plugin[2]}`,
								];
							}
						}),
						sourceMaps: false,
						sourceType: "module",
						inputSourceMap: false,
					},
				},
			},
		],
	},
	{
		test: /\.txt$/,
		type: "asset/source",
	},
	{
		test: /\.json$/,
		type: "json",
	},
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
					modules: false,
					importLoaders: 0,
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
					modules: false,
					importLoaders: 0,
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
		test: /\.(woff|woff2|svg|eot|otf|ttf|png|jpe?g|gif)(\?.*$|$)/,
		type: "asset/resource",
	}
);

config.plugins.push(
	new MiniCssExtractPlugin({
		filename: "spa/[name].css",
		chunkFilename: "spa/[id].css",
		linkType: "text/css",
		ignoreOrder: false,
	}),
	new CleanWebpackPlugin({
		root: settings.PROJECT_BUILD_PATH,
		cleanOnceBeforeBuildPatterns: ["spa/**/*"],
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
		sourceType: "var",
		context: settings.PROJECT_ROOT_PATH,
	}),
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../platform/dll/platform-prod-manifest.json"
		),
		sourceType: "var",
		context: settings.PROJECT_ROOT_PATH,
	}),
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../bootstrap/dll/bootstrap-prod-manifest.json"
		),
		sourceType: "var",
		context: settings.PROJECT_ROOT_PATH,
	}),
	new HTMLWebpackPlugin({
		template: path.resolve(settings.PROJECT_ROOT_PATH, "static/index.html"),
		filename: "spa/index.html",
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
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(settings.PROJECT_ROOT_PATH, "static"),
				to: settings.PROJECT_BUILD_PATH + "/spa",
				filter: async (resourcePath) =>
					!resourcePath.endsWith("index.html"),
			},
		],
	}),
	new AddAssetHtmlPlugin([
		{
			filepath: path.resolve(
				__dirname,
				"../../dependencies/dll/dependencies.dll.min.js"
			),
			outputPath: "spa",
			publicPath: `${settings.PROJECT_NAMESPACE}spa`,
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../platform/dll/platform.dll.min.js"
			),
			outputPath: "spa",
			publicPath: `${settings.PROJECT_NAMESPACE}spa`,
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../bootstrap/dll/bootstrap.dll.min.js"
			),
			outputPath: "spa",
			publicPath: `${settings.PROJECT_NAMESPACE}spa`,
			typeOfAsset: "js",
		},
	])
);

module.exports = config;
