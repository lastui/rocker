#!/usr/bin/env node

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

const { envelope } = require("./helpers/process.js");

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
  // public commands
  .command(envelope(require("./commands/build.js")))
  .command(envelope(require("./commands/start.js")))
  .command(envelope(require("./commands/test.js")))
  .command(envelope(require("./commands/lint.js")))
  // private commands
  .command(envelope(require("./commands/setup.js")))
  .demandCommand()
  .help(false).argv;
