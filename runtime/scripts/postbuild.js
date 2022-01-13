#!/usr/bin/env node

const path = require('path');
const { clearDirectory } = require('../../scripts');

////////////////////////////////

async function main() {
	await clearDirectory(path.resolve(__dirname, "../node_modules"));
}

////////////////////////////////

(function () {
	main();
})();