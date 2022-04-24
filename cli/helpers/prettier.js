const prettier = require("prettier/cli");

exports.run = async function () {
	process.on("unhandledRejection", (reason) => {
		throw reason;
	});

	await prettier.run([
		'--loglevel=warn',
		'--ignore-unknown',
		'--no-config',
		'--no-editorconfig',
		'--bracket-same-line',
		'--quote-props=as-needed',
		'--end-of-line=lf',
		'--print-width=120',
		'--trailing-comma=all',
		'--write',
		'(*\\.*|(src/**/*\\.*)|(messages/*\\.json))',
	]);
};