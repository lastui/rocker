const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const settings = require("../settings");

module.exports = {
	bail: true,
	output: {
		pathinfo: true,
		chunkLoadingGlobal: "lastuiJsonp",
		chunkLoading: "jsonp",
		path: settings.PROJECT_BUILD_PATH,
		publicPath: "/",
	},
	performance: {
		hints: "warning",
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
	devtool: false,
	optimization: {
		removeAvailableModules: true,
		removeEmptyChunks: true,
		mergeDuplicateChunks: true,
		providedExports: true,
		flagIncludedChunks: true,
		chunkIds: "named",
		moduleIds: "named",
		usedExports: true,
		sideEffects: false,
		emitOnErrors: true,
		concatenateModules: true,
		runtimeChunk: false,
		minimizer: settings.DEVELOPMENT
			? []
			: [
					new TerserPlugin({
						terserOptions: {
							compress: {
								ecma: 5,
								warnings: false,
								comparisons: false,
								inline: 2,
							},
							output: {
								ecma: 5,
								comments: false,
								ascii_only: true,
							},
						},
						parallel: true,
					}),
			  ],
	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
			process: ["process"],
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: settings.DEVELOPMENT
					? `"development"`
					: `"production"`,
			},
		}),
		new webpack.EnvironmentPlugin([
			...Object.keys(process.env),
			"NODE_ENV",
		]),
	],
};
