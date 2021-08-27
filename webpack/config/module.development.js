const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");
const ModuleLocalesPlugin = require("../plugins/ModuleLocalesPlugin");

const babel = require("@lastui/babylon");

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/development.js"),
};

config.output.filename = "module.js";

config.module.rules.push(
	{
		test: /\.jsx?$/,
		enforce: "pre",
		include: [settings.PROJECT_SRC_PATH, /node_modules\/\@lastui*/],
		exclude: [/node_modules\/(?!(\@lastui*))/],
		use: [
			{
				loader: "babel-loader",
				options: {
					babelrc: false,
					presets: babel.presets.map((preset) => {
						if (typeof preset === "string") {
							return [preset, {}, `babel-${preset}`];
						} else {
							return [preset[0], preset[1], `babel-${preset[2]}`];
						}
					}),
					plugins: babel.plugins.map((plugin) => {
						if (typeof plugin === "string") {
							return [plugin, {}, `babel-${plugin}`];
						} else {
							return [plugin[0], plugin[1], `babel-${plugin[2]}`];
						}
					}),
					sourceMaps: true,
					sourceType: "module",
					highlightCode: true,
					shouldPrintComment: (val) => /license/.test(val),
					compact: false,
					inputSourceMap: false,
				},
			},
			{
				loader: "@linaria/webpack-loader",
				options: {
					sourceMap: true,
					preprocessor: "stylis",
					cacheDirectory: path.join(
						settings.WEBPACK_ROOT_PATH,
						".linaria-cache"
					),
					classNameSlug: (hash, title) =>
						`${settings.PROJECT_NAME}__${title}__${hash}`,
					babelOptions: {
						babelrc: false,
						presets: babel.presets.map((preset) => {
							if (typeof preset === "string") {
								return [preset, {}, `linaria-${preset}`];
							} else {
								return [
									preset[0],
									preset[1],
									`linaria-${preset[2]}`,
								];
							}
						}),
						plugins: babel.plugins.map((plugin) => {
							if (typeof plugin === "string") {
								return [plugin, {}, `linaria-${plugin}`];
							} else {
								return [
									plugin[0],
									plugin[1],
									`linaria-${plugin[2]}`,
								];
							}
						}),
						sourceMaps: true,
						sourceType: "module",
						inputSourceMap: false,
					},
				},
			},
		],
	},
	{
		test: /\.txt$/,
		type: "asset/source",
	},
	{
		test: /\.json$/,
		type: "json",
	},
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
	new ModuleLocalesPlugin(),
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
				manifest = fs.readFileSync(
					path.resolve(process.cwd(), "manifest.json"),
					"utf8"
				);
			} catch (_) {
				const hotModule = {
					id: settings.PROJECT_NAME,
					program: {
						url: "/module.js",
					},
					locales: {},
					meta: {},
				};
				for (const language of settings.SUPPORTED_LOCALES) {
					hotModule.locales[language] = `/messages/${language}.json`;
				}
				manifest = JSON.stringify(
					{
						entrypoint: settings.PROJECT_NAME,
						available: [hotModule],
					}
				);
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
											return ${manifest.trim()};
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
