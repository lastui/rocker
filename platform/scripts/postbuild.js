#!/usr/bin/env node

const path = require("path");
const { clearDirectory } = require("../../scripts");

////////////////////////////////

async function main() {
	await clearDirectory(path.resolve(__dirname, "../node_modules"));
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
