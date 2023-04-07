#!/usr/bin/env node

import process from 'node:process';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { envelope } from "./helpers/process.mjs";

process.on("warning", (e) => console.warn(e.stack));
process.setMaxListeners(100);

yargs(hideBin(process.argv))
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
  .command(envelope(await import("./commands/build.mjs")))
  .command(envelope(await import("./commands/start.mjs")))
  .command(envelope(await import("./commands/test.mjs")))
  .command(envelope(await import("./commands/lint.mjs")))
  .demandCommand()
  .help(false).argv;
