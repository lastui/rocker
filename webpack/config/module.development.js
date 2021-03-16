const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

const HTMLWebpackPlugin = require("html-webpack-plugin");

const { Config } = require("webpack-config");

const settings = require(path.resolve(__dirname, "../settings"));

const dependenciesContent = fs.readFileSync(
	path.resolve(__dirname, "../../dependencies/dll/dependencies.dll.js"),
	{
		encoding: "utf8",
		flag: "r",
	}
);

const platformContent = fs.readFileSync(
	path.resolve(__dirname, "../../platform/dll/platform.dll.js"),
	{
		encoding: "utf8",
		flag: "r",
	}
);

module.exports = new Config()
	.extend(
		path.join(settings.WEBPACK_ROOT_PATH, "internal/base.js"),
		path.join(settings.WEBPACK_ROOT_PATH, "internal/loaders.js"),
		path.join(settings.WEBPACK_ROOT_PATH, "internal/development.js")
	)
	.merge({
		output: {
			filename: "[name].[fullhash].js",
		},
		plugins: [
			new webpack.DllReferencePlugin({
				manifest: path.resolve(
					__dirname,
					"../../dependencies/dll/dependencies-dev-manifest.json"
				),
				context: settings.PROJECT_ROOT_PATH,
			}),
			new webpack.DllReferencePlugin({
				manifest: path.resolve(
					__dirname,
					"../../platform/dll/platform-dev-manifest.json"
				),
				context: settings.PROJECT_ROOT_PATH,
			}),
			new HTMLWebpackPlugin({
				production: false,
				publicPath: "",
				minify: false,
				inject: false,
				scriptLoading: "blocking",
				templateContent: ({ htmlWebpackPlugin }) => `
					<html>
						<head>
							${htmlWebpackPlugin.tags.headTags}
							<style>
								body {
									margin: 0;
								}
							</style>
							<script>
								${dependenciesContent};
								${platformContent};
							</script>
						</head>
						<body>
							${htmlWebpackPlugin.tags.bodyTags}
						</body>
					</html>
				`,
			}),
		],
	});
