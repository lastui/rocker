const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const settings = require(path.resolve(__dirname, "../settings"));

module.exports = {
	bail: false,
	output: {
		pathinfo: false,
		chunkLoadingGlobal: "lastuiJsonp",
		chunkLoading: "jsonp",
		path: settings.PROJECT_DEV_PATH,
		publicPath: settings.PROJECT_NAMESPACE,
	},
	performance: {
		hints: false,
	},
	stats: {
		colors: true,
		all: false,
		assets: false,
		modules: true,
		timings: true,
		errors: true,
		errorDetails: true,
		errorStack: true,
	},
	devtool: "eval-cheap-module-source-map",
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
			process: ["process"],
		}),
		new webpack.DefinePlugin({
			process: {},
			"process.env": {},
			"process.env.NODE_ENV": `"development"`,
			"process.env.NODE_DEBUG": false,
			"process.env.VERSION":
				process.env.VERSION !== undefined
					? `"${process.env.VERSION}"`
					: `""`,
		}),
		new webpack.EnvironmentPlugin([
			...Object.keys(process.env),
			"NODE_ENV",
		]),
		new CleanWebpackPlugin({
			root: settings.PROJECT_DEV_PATH,
			cleanOnceBeforeBuildPatterns: ["**/*"],
			cleanStaleWebpackAssets: true,
			dangerouslyAllowCleanPatternsOutsideProject: false,
			verbose: false,
			dry: false,
		}),
	],
	watch: true,
};
