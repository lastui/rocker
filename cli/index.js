#!/usr/bin/env node

"use strict";

process.on("unhandledRejection", (reason) => {
  throw reason;
});

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

const path = require("path");

const isTTY = process.stdout.isTTY ? "1" : "0";
process.env.FORCE_COLOR = isTTY;
if (process.env.COLOR) {
  process.env.COLOR = isTTY;
}
if (process.env.COLOR) {
  process.env.COLOR = isTTY;
}

function envelope(command) {
  return {
    command: command.command,
    describe: command.describe,
    builder: command.builder,
    async handler(options) {
      if (options.cwd) {
        const { directoryExists } = await import("./helpers/io.mjs");
        const requested = path.resolve(options.cwd);
        if (await directoryExists(requested)) {
          process.env.INIT_CWD = requested;
        }
      }
      if (!process.env.INIT_CWD) {
        process.env.INIT_CWD = process.cwd();
      }

      const cleanupHooks = [];

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      for (const signal in ["SIGINT", "SIGTERM"]) {
        process.on(signal, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      }

      await command.handler(
        {
          ...options,
          _: options._.filter((item) => item !== command.command),
        },
        cleanupHooks,
      );
    },
  };
}

/* eslint-disable no-unused-expressions */
require("yargs")
  .parserConfiguration({
    "unknown-options-as-args": true,
    "populate--": false,
    "short-option-groups": true,
    "greedy-arrays": false,
  })
  .scriptName("rocker")
  .option("dev", {
    alias: "development",
    type: "boolean",
    describe: "Development mode",
  })
  .option("debug", {
    type: "boolean",
    describe: "Debug issue",
  })
  .option("quiet", {
    type: "boolean",
    describe: "Silence output",
  })
  .option("fix", {
    type: "boolean",
    describe: "Fix automatically fixable issues",
  })
  .option("cwd", {
    type: "string",
    describe: "Override working directory",
  })
  .conflicts("quiet", "debug")
  .command(envelope(require("./commands/build.js")))
  .command(envelope(require("./commands/upgrade.js")))
  .command(envelope(require("./commands/start.js")))
  .command(envelope(require("./commands/test.js")))
  .command(envelope(require("./commands/lint.js")))
  .demandCommand()
  .help(false).argv;
