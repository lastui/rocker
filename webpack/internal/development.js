const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackPluginServe } = require('webpack-plugin-serve');

const settings = require(path.resolve(__dirname, "../settings"));

module.exports = {
	bail: false,
	output: {
		pathinfo: true,
		chunkLoadingGlobal: "lastuiJsonp",
		chunkLoading: "jsonp",
		path: settings.PROJECT_DEV_PATH,
		publicPath: "/",
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
			"process.env": {
				NODE_ENV: `"development"`,
			},
			"__SANDBOX_SCOPE__": {}
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
		new WebpackPluginServe({
			hmr: false,
			historyFallback: true,
			host: '0.0.0.0',
			port: 5000,
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
	],
	watch: true,
};
