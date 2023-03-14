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
  })
  .option("debug", {
    alias: "development",
    type: "boolean",
  })
  .option("silent", {
    type: "boolean",
  })
  .option("fix", {
    type: "boolean",
  })
  .option("cwd", {
    type: "string",
  })
  .command(envelope(require("./commands/build.js")))
  .command(envelope(require("./commands/start.js")))
  .command(envelope(require("./commands/test.js")))
  .command(envelope(require("./commands/lint.js")))
  .demandCommand()
  .help(false).argv;
