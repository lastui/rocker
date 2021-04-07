const { execSync } = require("child_process");
const path = require("path");
const webpack = require("webpack");
const settings = require("../webpack/settings");
const cwd = path.resolve(process.cwd());

execSync(`mkdir -p ./node_modules/@lastui/rocker`);
execSync(`rm -f ./node_modules/@lastui/rocker/platform`);
execSync(`ln -s ${cwd}/src ./node_modules/@lastui/rocker/platform`);

const { dependencies } = require("../dependencies/webpack.config.js").entry;
for (const provided of dependencies) {
	execSync(`mkdir -p ./node_modules/${provided}`);
	execSync(`touch ./node_modules/${provided}/index.js`);
}

const config = require(path.resolve(
	settings.WEBPACK_ROOT_PATH,
	"config/dll.js"
));

config.entry = {
	platform: ["@lastui/rocker/platform"],
};

config.plugins.push(
	new webpack.DllReferencePlugin({
		manifest: path.resolve(
			__dirname,
			`../dependencies/dll/dependencies-${
				settings.DEVELOPMENT ? "dev" : "prod"
			}-manifest.json`
		),
		context: settings.PROJECT_ROOT_PATH,
	})
);

module.exports = config;
