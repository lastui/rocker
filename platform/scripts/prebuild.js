#!/usr/bin/env node

const path = require('path');
const { clearDirectory, createSymlink, ensureDirectory } = require('../../scripts');

////////////////////////////////

async function main() {
	await clearDirectory(path.resolve(__dirname, "../node_modules"));
	await createSymlink(path.resolve(__dirname, "../../dependencies/node_modules"), path.resolve(__dirname, "../node_modules"));
	await clearDirectory(path.resolve(__dirname, "../node_modules/@lastui/rocker"));
	await ensureDirectory(path.resolve(__dirname, "../node_modules/@lastui/rocker"));
	await createSymlink(path.resolve(__dirname, "../src"), path.resolve(__dirname, "../node_modules/@lastui/rocker/platform"));
}

////////////////////////////////

(function () {
	main()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
})();
