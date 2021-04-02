const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { WebpackPluginServe } = require('webpack-plugin-serve');

const settings = require("../settings");

const config = {
	...require("../internal/base.js"),
	...require("../internal/loaders.js"),
	...require("../internal/development.js"),
};

config.output.filename = "module.js";

config.plugins.push(
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
		middleware: (app, builtins) => {
		  app.use(async (ctx, next) => {
		  	if (ctx.request.url === '/context') {
		  		ctx.status = 200;
					ctx.body = JSON.stringify({
		  			'available': [{
		  				name: 'hot',
		  				url: '/module.js',
		  			}],
		  			'entrypoint': 'hot',
		  		})
					ctx.type = 'json'; 
		  	} else {
		  		await next();
		  	}
		  })
	    }
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
			const scripts = htmlWebpackPlugin.tags.bodyTags.filter((item) =>
				item.attributes.src !== 'module.js'	
			)
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
									dom.render(react.createElement(runtime.Main, null), document.getElementById("mount"))
								})
							}())
						</script>
						<div id="mount" />
					</body>
				</html>
			`
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
	]),
);

module.exports = config;
