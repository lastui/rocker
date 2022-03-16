#!/usr/bin/env node

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

require("yargs")
  .scriptName("rocker")
  .option("dev", {
    alias: "development",
    type: "boolean",
  })
  .command(require("./commands/build.js"))
  .command(require("./commands/start.js"))
  .demandCommand()
  .help(false)
  .argv;
