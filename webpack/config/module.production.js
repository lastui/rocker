const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require("../settings");

const babel = require("@lastui/babylon");

const config = {
	...require("../internal/base.js"),
	...require("../internal/build.js"),
};

config.output.filename = "[name].min.js";

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
					presets: babel.presets,
					plugins: babel.plugins.map((plugin) => {
						if (typeof plugin === 'string') {
							return [plugin, {}, `babel-${plugin}`]
						} else {
							return [plugin[0], plugin[1], `babel-${plugin[2]}`]
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
					classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
					babelOptions: {
						babelrc: false,
						presets: [],
						plugins: babel.plugins.map((plugin) => {
							if (typeof plugin === 'string') {
								return [plugin, {}, `linaria-${plugin}`]
							} else {
								return [plugin[0], plugin[1], `linaria-${plugin[2]}`]
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
					attributes: { id: "rocker" },
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
					attributes: { id: "rocker" },
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
