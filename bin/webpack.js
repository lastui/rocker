#!/usr/bin/env node

const chalk = require("chalk");
const path = require("path");
const { run } = require("webpack-nano/lib/compiler");
const args = require("webpack-nano/argv");

process.on('warning', (e) => console.warn(e.stack));
process.setMaxListeners(100);

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

if (process.env.NODE_ENV !== "production") {
	process.env.NODE_ENV = "development";
}

function getConfig() {
	if (args.config === undefined) {
		return require(path.resolve("./webpack.config.js"));
	}
	return require(path.resolve(args.config));
}

function patchEntrypoint(config) {
	if (!config.watch) {
		return config;
	}
	for (const entrypoint in config.entry) {
		config.entry[entrypoint] = [
			"webpack-plugin-serve/client",
			...config.entry[entrypoint],
		];
	}
	return config;
}

const logPrefix = {
	ok: chalk.blue("⬡ webpack:"),
	whoops: chalk.red("⬢ webpack:"),
};

const config = patchEntrypoint(getConfig());

run(
	{
		config,
		watchConfig: config.watch ? config : undefined,
	},
	{
		error: (...args) => {
			args.unshift(logPrefix.whoops);
			console.error(...args);
		},
		info: (...args) => {
			args.unshift(logPrefix.ok);
			console.error(...args);
		},
	}
);
