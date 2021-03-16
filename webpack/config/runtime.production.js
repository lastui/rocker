const path = require("path");
const webpack = require("webpack");
const { Config } = require("webpack-config");

const settings = require(path.resolve(__dirname, "../settings"));

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

module.exports = new Config()
	.extend(
		path.join(settings.WEBPACK_ROOT_PATH, "internal/base.js"),
		path.join(settings.WEBPACK_ROOT_PATH, "internal/loaders.js"),
		path.join(settings.WEBPACK_ROOT_PATH, "internal/build.js")
	)
	.merge({
		output: {
			filename: "[name].js",
		},
		plugins: [
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
			new HTMLWebpackPlugin({
				template: path.resolve(
					settings.PROJECT_ROOT_PATH,
					"static/index.html"
				),
				production: true,
				publicPath: "/",
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
			new AddAssetHtmlPlugin([
				{
					filepath: path.resolve(
						__dirname,
						"../../dependencies/dll/dependencies.dll.min.js"
					),
					typeOfAsset: "js",
				},
				{
					filepath: path.resolve(
						__dirname,
						"../../platform/dll/platform.dll.min.js"
					),
					typeOfAsset: "js",
				},
			]),
		],
	});
