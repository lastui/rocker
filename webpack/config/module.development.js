const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const settings = require("../settings");

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

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/development.js"),
};

config.output.filename = "[name].[fullhash].js";

config.plugins.push(
	...[
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
	]
);

module.exports = config;
