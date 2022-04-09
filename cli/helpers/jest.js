const path = require('path');
const jest = require('jest');
const options = require(path.resolve(__dirname, '../../jest/index.js'));

exports.run = async function() {
	await jest.runCLI(options, [options.rootDir])
}
