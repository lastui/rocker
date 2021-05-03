const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/development.js"),
};

config.output.filename = "module.js";

config.module.rules.push(
	{
		test: /\.css$/i,
		use: [
			{
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
					attributes: { id: "rocker" },
				},
			},
			{
				loader: "css-loader",
				options: {
					sourceMap: false,
					importLoaders: 1,
				},
			},
		],
	},
	{
		test: /\.s[a|c]ss$/,
		use: [
			{
				loader: "style-loader",
				options: {
					injectType: "singletonStyleTag",
					attributes: { id: "rocker" },
				},
			},
			{
				loader: "css-loader",
				options: {
					sourceMap: false,
					modules: false,
					importLoaders: 0,
				},
			},
			{
				loader: "sass-loader",
				options: {
					implementation: require("sass"),
					sassOptions: {
						fiber: false,
					},
					sourceMap: false,
				},
			},
		],
	},
	{
		test: /\.(png|jpg|gif)$/i,
		dependency: { not: ["url"] },
		type: "asset/inline",
	},
	{
		test: /\.(woff|woff2|svg|eot|otf|ttf)(\?.*$|$)/,
		type: "asset/resource",
	}
);

config.plugins.push(
	new WebpackPluginServe({
		hmr: false,
		historyFallback: true,
		host: "0.0.0.0",
		port: settings.DEV_SERVER_PORT,
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
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			"../../runtime/dll/runtime-dev-manifest.json"
		),
		context: settings.PROJECT_ROOT_PATH,
	}),
	new HTMLWebpackPlugin({
		production: false,
		publicPath: "",
		minify: false,
		inject: false,
		scriptLoading: "blocking",
		templateContent: ({ htmlWebpackPlugin }) => {
			const scripts = htmlWebpackPlugin.tags.bodyTags.filter(
				(item) => item.attributes.src !== "module.js"
			);
			let manifest;
			try {
			  manifest = fs.readFileSync(path.resolve(process.cwd(), 'manifest.json'), 'utf8')
			} catch (_) {
			  manifest = `
			  	{
						available: [
							{
								id: "${PROJECT_NAME}",
								url: "/module.js",
								meta: {},
							},
						],
						entrypoint: "${PROJECT_NAME}",
					}
				`
			}

			return `
				<html>
					<head>
						${htmlWebpackPlugin.tags.headTags}
					</head>
					<body>
						${scripts}
						<script>
							(function(){
								"use strict";

								const react = dependencies_dll("./node_modules/react/index.js");
								const dom = dependencies_dll("./node_modules/react-dom/index.js");
								const runtime = runtime_dll("./node_modules/@lastui/rocker/runtime/index.js");

								window.addEventListener("load", function() {
									dom.render(react.createElement(runtime.Main, {
										fetchContext: async function() {
											return ${manifest};
										}
									}), document.getElementById("mount"))
								})
							}())
						</script>
						<div id="mount" />
					</body>
				</html>
			`;
		},
	}),
	new AddAssetHtmlPlugin([
		{
			filepath: path.resolve(
				__dirname,
				"../../dependencies/dll/dependencies.dll.js"
			),
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../platform/dll/platform.dll.js"
			),
			typeOfAsset: "js",
		},
		{
			filepath: path.resolve(
				__dirname,
				"../../runtime/dll/runtime.dll.js"
			),
			typeOfAsset: "js",
		},
	])
);

module.exports = config;