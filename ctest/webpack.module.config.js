const path = require('path');
const webpack = require('webpack');

const settings = require('../webpack/settings');
const { Config } = require('webpack-config');
const manifest = require('./package.json');

module.exports = new Config()
	.extend(path.resolve(settings.WEBPACK_ROOT_PATH, 'config/module.js'))
	.merge({
		entry: {
			main: ['./src/index.js'],
		},
	})



