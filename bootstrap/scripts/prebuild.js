#!/usr/bin/env node

const path = require('path');
const { clearDirectory, createSymlink, ensureDirectory } = require('../../scripts');

////////////////////////////////

async function main() {
	await clearDirectory(path.resolve(__dirname, "../node_modules"));
	await createSymlink(path.resolve(__dirname, "../../dependencies/node_modules"), path.resolve(__dirname, "../node_modules"));
	await clearDirectory(path.resolve(__dirname, "../node_modules/@lastui/rocker"));
	await clearDirectory(path.resolve(__dirname, "../node_modules/@redux-devtools"));
	await ensureDirectory(path.resolve(__dirname, "../node_modules/@lastui/rocker"));
	await createSymlink(path.resolve(__dirname, "../../platform/src"), path.resolve(__dirname, "../node_modules/@lastui/rocker/platform"));
	await createSymlink(path.resolve(__dirname, "../src"), path.resolve(__dirname, "../node_modules/@lastui/rocker/bootstrap"));
	await createSymlink(path.resolve(__dirname, "../../node_modules/@redux-devtools"), path.resolve(__dirname, "../node_modules/@redux-devtools"));
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
