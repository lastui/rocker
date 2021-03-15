const path = require('path');
const babel = require('@lastui/babylon');

const settings = require(path.resolve(__dirname, '../settings'));

module.exports = {
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				enforce: 'pre',
				include: [
					settings.PROJECT_SRC_PATH,
					/node_modules\/\@lastui*/,
				],
				exclude: [
					/node_modules\/(?!(\@lastui*))/,
				],
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: false,
						...babel,
						cacheDirectory: settings.DEVELOPMENT,
						cacheCompression: false,
						sourceMaps: settings.DEVELOPMENT,
					},
				},
			},
		],
	},
}