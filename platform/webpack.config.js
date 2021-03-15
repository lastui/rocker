const shell = require('child_process').execSync;

const path = require('path');
const webpack = require('webpack');
const settings = require('../webpack/settings');

const { Config } = require('webpack-config');

shell(`rm -rf ./node_modules/@lastui/rocker/platform 2>/dev/null || :`);
shell(`mkdir -p ./node_modules/@lastui/rocker/platform`);
shell(`cp -r src/* ./node_modules/@lastui/rocker/platform`);

module.exports = new Config()
	.extend(path.resolve(settings.WEBPACK_ROOT_PATH, 'config/dll.js'))
	.merge({
		entry: {
			platform: ['@lastui/rocker/platform'],
		},
		plugins: [
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, `../dependencies/dll/dependencies-${settings.DEVELOPMENT ? 'dev' : 'prod'}-manifest.json`),
				context: settings.PROJECT_ROOT_PATH,
			}),
		],
	})