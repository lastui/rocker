const path = require("path");
const webpack = require("webpack");

const { setLogLevel } = require("webpack/hot/log");
setLogLevel("none");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const settings = require("../settings");
const babel = require("@lastui/babylon").env.development;

const config = {
	...require("../internal/base.js"),
	...require("../internal/development.js"),
};

config.devServer = {
	hot: true,
	liveReload: false,
	setupExitSignals: true,
	static: {
		publicPath: ["/"],
		directory: settings.PROJECT_DEV_PATH,
	},
	devMiddleware: {
		publicPath: "/",
	},
	https: false,
	allowedHosts: "all",
	historyApiFallback: true,
	compress: false,
	host: "0.0.0.0",
	port: settings.DEV_SERVER_PORT,
	client: {
		overlay: {
			errors: true,
			warnings: false,
		},
		logging: settings.LOG_LEVEL,
		webSocketURL: {
			hostname: "0.0.0.0",
			pathname: "/ws",
			port: settings.DEV_SERVER_PORT,
		},
	},
};

config.output.filename = "[name].js";

config.resolve.alias["react-dom"] = "react-dom/profiling";
config.resolve.alias["scheduler/tracing"] = "scheduler/tracing-profiling";

config.module.rules.push(
	{
		test: /\.jsx?$/,
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
					compact: false,
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
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
				},
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
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
				},
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
		test: /\.(png|jpe?g|gif)$/i,
		dependency: { not: ["url"] },
		type: "asset/inline",
	},
	{
		test: /\.(woff|woff2|svg|eot|otf|ttf)(\?.*$|$)/,
		type: "asset/resource",
	}
);

config.plugins.push(
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../dependencies/dll/dependencies-dev-manifest.json"
		),
		sourceType: 'var',
		context: settings.PROJECT_ROOT_PATH,
	}),
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../platform/dll/platform-dev-manifest.json"
		),
		sourceType: 'var',
		context: settings.PROJECT_ROOT_PATH,
	}),
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../bootstrap/dll/bootstrap-dev-manifest.json"
		),
		sourceType: 'var',
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
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(settings.PROJECT_ROOT_PATH, "static"),
				to: settings.PROJECT_DEV_PATH,
				filter: async (resourcePath) => !resourcePath.endsWith("index.html"),
			},
		],
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
				"../../bootstrap/dll/bootstrap.dll.js"
			),
			typeOfAsset: "js",
		},
	])
);

module.exports = config;
