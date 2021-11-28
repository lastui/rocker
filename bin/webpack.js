#!/usr/bin/env node

let cleanupHooks = [];

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

if (process.env.NODE_ENV !== "production") {
	process.env.NODE_ENV = "development";
}

function isLikelyASyntaxError(message) {
	return message.indexOf("Syntax error:") !== -1;
}

function formatMessage(message) {
	let lines = [];

	if (typeof message === "string") {
		lines = message.split("\n");
	} else if ("message" in message) {
		lines = message["message"].split("\n");
	} else if (Array.isArray(message)) {
		message.forEach((message) => {
			if ("message" in message) {
				lines = message["message"].split("\n");
			}
		});
	}
	lines = lines.filter((line) => !/Module [A-z ]+\(from/.test(line));
	lines = lines.map((line) => {
		const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
			line
		);
		if (!parsingError) {
			return line;
		}
		const [, errorLine, errorColumn, errorMessage] = parsingError;
		return `Syntax error: ${errorMessage} (${errorLine}:${errorColumn})`;
	});
	message = lines.join("\n");
	message = message.replace(
		/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
		`Syntax error: $3 ($1:$2)\n`
	);
	message = message.replace(
		/^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
		`Attempted import error: '$1' is not exported from '$2'.`
	);
	message = message.replace(
		/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
		`Attempted import error: '$2' does not contain a default export (imported as '$1').`
	);
	message = message.replace(
		/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
		`Attempted import error: '$1' is not exported from '$3' (imported as '$2').`
	);
	lines = message.split("\n");
	if (lines.length > 2 && lines[1].trim() === "") {
		lines.splice(1, 1);
	}
	lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, "$1");
	if (lines[1] && lines[1].indexOf("Module not found: ") === 0) {
		lines = [
			lines[0],
			lines[1]
				.replace("Error: ", "")
				.replace(
					"Module not found: Cannot find file:",
					"Cannot find file:"
				),
		];
	}
	if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
		lines[1] = "To import Sass files, you first need to install sass.\n";
		lines[1] +=
			"Run `npm install sass` or `yarn add sass` inside your workspace.";
	}

	message = lines.join("\n");
	message = message.replace(
		/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
		""
	);
	message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, "");
	lines = message.split("\n");
	lines = lines.filter(
		(line, index, arr) =>
			index === 0 ||
			line.trim() !== "" ||
			line.trim() !== arr[index - 1].trim()
	);
	message = lines.join("\n");
	return message.trim();
}

function formatWebpackMessages(json) {
const formattedErrors = json.errors.map(formatMessage);
const formattedWarnings = json.warnings.map(formatMessage);
const result = { errors: formattedErrors, warnings: formattedWarnings };
if (result.errors.some(isLikelyASyntaxError)) {
	result.errors = result.errors.filter(isLikelyASyntaxError);
}
return result;
}

async function main() {

	const ipaddr = require("ipaddr.js");
	const chalk = (await import("chalk")).default;
	const path = require("path");
	const webpack = require("webpack");
	const WebpackDevServer = require("webpack-dev-server");

	const config = require(path.resolve("./webpack.config.js"));

	const callback = (err, stats) => {
		if (err) {
			console.log(chalk.red("Failed to compile.\n"));
			console.log(err);
			return;
		}
		if (!stats) {
			return;
		}
		const statsData = stats.toJson({
			all: false,
			warnings: true,
			errors: true,
		});
		const messages = formatWebpackMessages(statsData);
		const isSuccessful = !messages.errors.length && !messages.warnings.length;
		if (isSuccessful) {
			console.log(chalk.green("Compiled successfully!"));
		}
		if (messages.errors.length) {
			if (messages.errors.length > 1) {
				messages.errors.length = 1;
			}
			console.log(chalk.red("Failed to compile.\n"));
			console.log(chalk.red(messages.errors.join("\n\n")));
			return;
		}
		if (messages.warnings.length) {
			console.log(chalk.yellow("Compiled with warnings.\n"));
			console.log(chalk.yellow(messages.warnings.join("\n\n")));
		}
	};

	if (config.watch) {
		config.infrastructureLogging = { level: "none" };
		const devServerConfig = config.devServer;
		devServerConfig.client.logging = "none";
		delete config.devServer;
		config.stats = "none";
		const compiler = webpack(config, callback);
		compiler.hooks.invalid.tap("invalid", () => {
			console.log("Compiling...");
		});
		const devServer = new WebpackDevServer(devServerConfig, compiler);
		devServer.startCallback((err) => {
			if (err) {
				callback(err);
			}
			let host = ipaddr.parse(devServer.options.host);
			if (host.range() === "unspecified") {
				host = "localhost";
			}
			console.log(
				chalk.green(
					`Project is running at: ${
						devServer.options.https ? "https://" : "http://"
					}${host}:${devServer.options.port}`
				)
			);
		});
		cleanupHooks.push(() => devServer.close());
	} else {
		webpack(config).run(callback);
	}
}

main();

cleanupHooks.push(() => process.exit(0));

const signals = ["SIGINT", "SIGTERM"];
signals.forEach(function (sig) {
	process.on(sig, async () => {
		cleanupHooks.forEach((hook) => hook());
	});
});