const path = require('path');
const webpack = require('webpack');
const settings = require(path.resolve(__dirname, '../settings'));

const implicits = {
	'process.env': {
		'NODE_ENV': settings.DEVELOPMENT ? `"development"` : `"production"`,
	},
};

if (settings.DEVELOPMENT) {
	implicits['__SANDBOX_SCOPE__'] = {};
}

module.exports = {
	bail: true,
	target: 'web',
	mode: settings.DEVELOPMENT ? 'development' : 'production',
	filename: __dirname,
	output: {
		pathinfo: false,
		chunkLoadingGlobal: 'lastui_jsonp',
		chunkLoading: 'jsonp',
		path: settings.PROJECT_BUILD_PATH,
		publicPath: '',
	},
	module: {
		strictExportPresence: true,
	},
	resolve: {
		unsafeCache: false,
		modules: [
			settings.PROJECT_SRC_PATH,
			'node_modules',
		],
		extensions: [
			'.js',
			'.jsx',
		],
		mainFields: ['browser', 'main'],
		enforceExtension: false,
		fallback: {
			util: require.resolve('util'),
			process: false,
			os: require.resolve('os-browserify'),
			stream: require.resolve('stream-browserify'),
			buffer: require.resolve('buffer'),
			path: require.resolve('path-browserify'),
		},
	},
	cache: settings.DEVELOPMENT,
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
			process: ['process'],
		}),
		new webpack.DefinePlugin(implicits),
		new webpack.EnvironmentPlugin([
			...Object.keys(process.env),
			'NODE_ENV',
		]),
	],
}