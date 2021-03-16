const path = require('path');
const webpack = require('webpack');
const { Config } = require('webpack-config');

const settings = require(path.resolve(__dirname, '../settings'));

const HTMLWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = new Config()
	.extend(
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/base.js'),
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/loaders.js'),
		path.join(settings.WEBPACK_ROOT_PATH, 'internal/development.js'),
	)
	.merge({
		output: {
			filename: `[name].[fullhash].js`,
		},
		plugins: [
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, '../../dependencies/dll/dependencies-dev-manifest.json'),
				context: settings.PROJECT_ROOT_PATH,
			}),
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, '../../platform/dll/platform-dev-manifest.json'),
				context: settings.PROJECT_ROOT_PATH,
			}),
			new HTMLWebpackPlugin({
				template: path.resolve(settings.PROJECT_ROOT_PATH, 'static/index.html'),
				production: false,
				publicPath: '',
				minify: false,
				inject: 'body',
			}),
			new AddAssetHtmlPlugin({
				filepath: path.resolve(__dirname, '../../dependencies/dll/dependencies.dll.js'),
			}),
			new AddAssetHtmlPlugin({
				filepath: path.resolve(__dirname, '../../platform/dll/platform.dll.js'),
			}),
		],
	})