#!/usr/bin/env node

const path = require("path");
const { clearDirectory } = require("../../cli/helpers/io");

function resolve(node) {
  return path.resolve(__dirname, node);
}

async function rm(target) {
  await clearDirectory(resolve(target));
}

async function main() {
  await rm("../node_modules");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });