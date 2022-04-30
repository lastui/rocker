#!/usr/bin/env node

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

if (!process.env.INIT_CWD) {
  process.env.INIT_CWD = process.cwd();
}

require("yargs")
  .scriptName("rocker")
  .option("dev", {
    alias: "development",
    type: "boolean",
  })
  .option("silent", {
    type: "boolean",
  })
  .option("fix", {
    type: "boolean",
  })
  .command(require("./commands/build.js"))
  .command(require("./commands/start.js"))
  .command(require("./commands/test.js"))
  .command(require("./commands/lint.js"))
  .demandCommand()
  .help(false)
  .strict().argv;