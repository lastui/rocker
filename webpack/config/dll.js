const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require("../settings");

const babel = require("@lastui/babylon").env[settings.DEVELOPMENT ? 'development' : 'production'];

const config = {
	...require("../internal/base.js"),
	...require("../internal/build.js"),
};

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
						if (typeof preset === 'string') {
							return [preset, {}, `babel-${preset}`]
						} else {
							return [preset[0], preset[1], `babel-${preset[2]}`]
						}
					}),
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
						presets: babel.presets.map((preset) => {
							if (typeof preset === 'string') {
								return [preset, {}, `linaria-${preset}`]
							} else {
								return [preset[0], preset[1], `linaria-${preset[2]}`]
							}
						}),
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
)

config.output.path = settings.DLL_BUILD_PATH;
config.output.filename = `[name].dll${settings.DEVELOPMENT ? "" : ".min"}.js`;
config.output.library = {
	name: "[name]_dll",
	type: "var"
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
		entryOnly: false,
		format: true,
		context: settings.PROJECT_ROOT_PATH,
		path: path.join(
			settings.DLL_BUILD_PATH,
			`[name]-${settings.DEVELOPMENT ? "dev" : "prod"}-manifest.json`
		),
		name: "[name]_dll",
	})
);

module.exports = config;