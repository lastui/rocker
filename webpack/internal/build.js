const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const settings = require("../settings");

module.exports = {
	bail: true,
	output: {
		iife: true,
		pathinfo: false,
		chunkLoadingGlobal: "lastuiJsonp",
		chunkLoading: "jsonp",
		wasmLoading: false,
		path: settings.PROJECT_BUILD_PATH,
		publicPath: settings.PROJECT_NAMESPACE,
		globalObject: "this",
	    environment: {
	    	arrowFunction: settings.DEVELOPMENT,
	    }
	},
	performance: {
		hints: settings.DEVELOPMENT ? false : "warning"
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
							banner: (licenseFile) => "License information can be found in LICENSE.txt",
						},
						terserOptions: {
							sourceMap: false,
							toplevel: true,
							parse: {
								ecma: 8,
								html5_comments: false,
							},
							compress: {
								ecma: 5,
								warnings: false,
								comparisons: false,
								inline: 2,
								arrows: false,
								booleans_as_integers: false,
								computed_props: true,
								dead_code: true,
								drop_debugger: true,
							},
							output: {
								ecma: 5,
								comments: false,
								ascii_only: true,
								indent_level: 0,
								comments: false,
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
			"process.env.VERSION": `"${process.env.VERSION}"`,
		}),
	],
};