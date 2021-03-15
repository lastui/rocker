const path = require('path');

const settings = require('../webpack/settings');

const { Config } = require('webpack-config');

const manifest = require('./node_modules/@lastui/dependencies/package.json');

module.exports = new Config()
	.extend(path.resolve(settings.WEBPACK_ROOT_PATH, 'config/dll.js'))
	.merge({
		entry: {
			dependencies: Object.keys(manifest.dependencies),
		}
	})