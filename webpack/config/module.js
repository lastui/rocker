const path = require('path');
const { Config, environment } = require('webpack-config');

const settings = require(path.resolve(__dirname, '../settings'));

environment.setAll({
	env: () => settings.DEVELOPMENT ? 'development' : 'production',
});

module.exports = new Config()
	.extend(path.join(settings.WEBPACK_ROOT_PATH, 'config/module.[env].js'))