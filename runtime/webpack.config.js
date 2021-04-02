const shell = require("child_process").execSync;

const path = require("path");
const webpack = require("webpack");
const settings = require("../webpack/settings");

shell(`rm -rf ./node_modules/@lastui/rocker/runtime 2>/dev/null || :`);
shell(`mkdir -p ./node_modules/@lastui/rocker/runtime`);
shell(`cp -r src/* ./node_modules/@lastui/rocker/runtime`);

shell(`mkdir -p ./node_modules/@lastui/rocker/platform`);
shell(`touch ./node_modules/@lastui/rocker/platform/index.js`);

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	runtime: ["@lastui/rocker/runtime"],
};

config.plugins.push(
	...[
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				`../dependencies/dll/dependencies-${
					settings.DEVELOPMENT ? "dev" : "prod"
				}-manifest.json`
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(
				__dirname,
				`../platform/dll/platform-${
					settings.DEVELOPMENT ? "dev" : "prod"
				}-manifest.json`
			),
			context: settings.PROJECT_ROOT_PATH,
		}),
	]
);

module.exports = config;
