const prettier = require("prettier/cli");

exports.run = async function (options) {
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
		...(options.fix ? ['--write']: ['--check']),
		'(*\\.*|(src/**/*\\.*)|(messages/*\\.json))',
	]);
};