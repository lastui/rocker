#!/usr/bin/env node

const path = require("path");
const { clearDirectory } = require("../../cli/helpers/io");

async function rm(target) {
  await clearDirectory(target);
}

async function main() {
  await rm(path.resolve(__dirname, "..", "node_modules"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });