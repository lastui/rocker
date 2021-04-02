const shell = require("child_process").execSync;

const path = require('path');

const settings = require('../webpack/settings');

shell(`rm -rf ./node_modules/@lastui/rocker 2>/dev/null || :`);
shell(`mkdir -p ./node_modules/@lastui/rocker/runtime/dll`);
shell(`mkdir -p ./node_modules/@lastui/rocker/platform/dll`);
shell(`mkdir -p ./node_modules/@lastui/rocker/dependencies/dll`);

shell(`cp -r ../runtime/dll/* ./node_modules/@lastui/rocker/runtime/dll/`);
shell(`cp -r ../platform/dll/* ./node_modules/@lastui/rocker/platform/dll/`);
shell(`cp -r ../dependencies/dll/* ./node_modules/@lastui/rocker/dependencies/dll/`);

shell(`touch ./node_modules/@lastui/rocker/runtime/index.js`);
shell(`touch ./node_modules/@lastui/rocker/dependencies/index.js`);
shell(`touch ./node_modules/@lastui/rocker/platform/index.js`);

const config = require(path.resolve(settings.WEBPACK_ROOT_PATH, 'config/spa.js'));

config.entry = {
	example: ['./src/index.js'],
}

module.exports = config;