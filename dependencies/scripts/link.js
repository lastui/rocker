#!/usr/bin/env node

const path = require("path");
const { clearDirectory, createSymlink, ensureDirectory } = require("../../cli/helpers/io");

async function rm(target) {
  await clearDirectory(target);
}

async function mkdir(target) {
  await ensureDirectory(target);
}

async function ln(source, target) {
  await createSymlink(source, target);
}

async function main() {
  await rm(path.resolve(__dirname, "..", "node_modules", "core-js"));
  await ln(
    path.resolve(__dirname, "..", "..", "node_modules", "core-js"),
    path.resolve(__dirname, "..", "node_modules", "core-js"),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
