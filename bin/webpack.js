#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const { run } = require('webpack-nano/lib/compiler');
const args = require('webpack-nano/argv');

const end = () => process.exit(0);

process.on('SIGINT', end);
process.on('SIGTERM', end);

if (process.env.NODE_ENV !== 'production') {
	process.env.NODE_ENV = 'development';
};

const config = require(path.resolve(args.config === undefined
	? './webpack.config.js'
	: args.config));

if (config.watch) {
	for (const entrypoint in config.entry) {
		config.entry[entrypoint] = [
			"webpack-plugin-serve/client",
			...config.entry[entrypoint],
		];
	}
}

const logPrefix = {
	ok: chalk.blue('⬡ webpack:'),
	whoops: chalk.red('⬢ webpack:'),
};

const log = {
	error: (...args) => {
	  args.unshift(logPrefix.whoops);
	  console.error(...args);
	},
	info: (...args) => {
	  args.unshift(logPrefix.ok);
	  console.error(...args);
	}
};

run({
	config,
	watchConfig: config.watch ? config : undefined,
}, log);
