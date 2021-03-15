const path = require('path');
const webpack = require('webpack');

const settings = require(path.resolve(__dirname, '../settings'));

module.exports = {
	performance: {
		hints: false,
	},
	devServer: {
		compress: false,
		clientLogLevel: settings.LOG_LEVEL,
		host: '0.0.0.0',
		port: 5000,
		hot: false,
		open: false,
		watchContentBase: true,
		https: false,
		quiet: false,
		noInfo: false,
		contentBase: settings.PROJECT_BUILD_PATH,
		historyApiFallback: {
			index: '',
			disableDotRule: true,
		},
		overlay: {
			errors: true,
			warnings: true,
		},
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 1000,
			poll: 1000,
			followSymlinks: false,
		},
	},
	devtool: 'eval-cheap-module-source-map',
	plugins: [
		new webpack.ProgressPlugin(),
	],
}