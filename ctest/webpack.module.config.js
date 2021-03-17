const path = require('path');
const settings = require('../webpack/settings');

const config = require(path.resolve(settings.WEBPACK_ROOT_PATH, 'config/module.js'));

config.entry =  {
	main: ['./src/index.js'],
};

module.exports = settings.withHot(config);
