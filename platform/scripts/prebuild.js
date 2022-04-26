#!/usr/bin/env node

const path = require("path");
const { clearDirectory, createSymlink, ensureDirectory } = require("../../cli/helpers/io");

function resolve(node) {
  return path.resolve(__dirname, node);
}

async function rm(target) {
  await clearDirectory(resolve(target));
}

async function mkdir(target) {
  await ensureDirectory(resolve(target));
}

async function ln(source, target) {
  await createSymlink(resolve(source), resolve(target));
}

async function main() {
  await rm("../node_modules");
  await ln("../../dependencies/node_modules", "../node_modules");
  await rm("../node_modules/@lastui");
  await mkdir("../node_modules/@lastui");
  await mkdir("../node_modules/@lastui/rocker");
  await ln("../../dependencies", "../node_modules/@lastui/dependencies");
  await ln("../src", "../node_modules/@lastui/rocker/platform");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });