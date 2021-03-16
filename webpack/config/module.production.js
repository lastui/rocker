const path = require('path');
const webpack = require('webpack');
const { Config } = require('webpack-config');

const settings = require(path.resolve(__dirname, '../settings'));

module.exports = new Config()
	.extend(
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/base.js'),
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/loaders.js'),
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/build.js'),
	)
	.merge({
		output: {
			filename: `[name]${settings.DEVELOPMENT ? '' : '.min'}.js`,
		},
		plugins: [
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, '../../dependencies/dll/dependencies-prod-manifest.json'),
				context: settings.PROJECT_ROOT_PATH,
			}),
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, '../../platform/dll/platform-prod-manifest.json'),
				context: settings.PROJECT_ROOT_PATH,
			}),
		],
	})