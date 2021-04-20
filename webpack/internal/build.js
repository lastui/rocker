const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const settings = require("../settings");

module.exports = {
	bail: true,
	output: {
		pathinfo: false,
		chunkLoadingGlobal: "lastuiJsonp",
		chunkLoading: "jsonp",
		path: settings.PROJECT_BUILD_PATH,
		publicPath: settings.PROJECT_NAMESPACE,
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
		minimize: !settings.DEVELOPMENT,
		minimizer: settings.DEVELOPMENT
			? []
			: [
					new TerserPlugin({
						extractComments: {
							condition: /^\**!|license/i,
							filename: (fileData) => "LICENSE.txt",
							banner: (licenseFile) =>
								"License information can be found in LICENSE.txt",
						},
						terserOptions: {
							parse: {
								ecma: 8,
							},
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
			process: false,
			"process.env.NODE_ENV": settings.DEVELOPMENT
				? `"development"`
				: `"production"`,
			"process.env.NODE_DEBUG": false,
		}),
	],
};