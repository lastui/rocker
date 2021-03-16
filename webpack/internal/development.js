const { Readable } = require("stream");

const path = require("path");
const webpack = require("webpack");

const settings = require(path.resolve(__dirname, "../settings"));

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
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
	devServer: {
		compress: false,
		clientLogLevel: settings.LOG_LEVEL,
		host: "0.0.0.0",
		port: 5000,
		hot: false,
		open: false,
		watchContentBase: true,
		https: false,
		quiet: false,
		noInfo: false,
		contentBase: path.resolve(settings.PROJECT_BUILD_PATH, "dev"),
		historyApiFallback: {
			index: "/",
			disableDotRule: true,
		},
		before: (app, server, compiler) => {
			app.get("/context", (req, res) => {
				res.json({
					available: [],
					entrypoint: "main",
				});
			});
		},
		overlay: {
			errors: true,
			warnings: true,
		},
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 1000,
			poll: 1000,
			followSymlinks: false,
		},
	},
	devtool: "eval-cheap-module-source-map",
	plugins: [
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin({
			root: settings.PROJECT_BUILD_PATH,
			cleanOnceBeforeBuildPatterns: ["**/*"],
			cleanStaleWebpackAssets: true,
			dangerouslyAllowCleanPatternsOutsideProject: false,
			verbose: false,
			dry: false,
		}),
	],
};
