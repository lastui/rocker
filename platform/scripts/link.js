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
  await rm(path.resolve(__dirname, "..", "node_modules"));
  await ln(
    path.resolve(__dirname, "..", "..", "dependencies", "node_modules"),
    path.resolve(__dirname, "..", "node_modules"),
  );
  await rm(path.resolve(__dirname, "..", "node_modules", "core-js"));
  await ln(
    path.resolve(__dirname, "..", "..", "node_modules", "core-js"),
    path.resolve(__dirname, "..", "node_modules", "core-js"),
  );
  await rm(path.resolve(__dirname, "..", "node_modules", "@lastui"));
  await mkdir(path.resolve(__dirname, "..", "node_modules", "@lastui"));
  await mkdir(path.resolve(__dirname, "..", "node_modules", "@lastui", "rocker"));
  await ln(
    path.resolve(__dirname, "..", "..", "dependencies"),
    path.resolve(__dirname, "..", "node_modules", "@lastui", "dependencies"),
  );
  await ln(
    path.resolve(__dirname, "..", "src"),
    path.resolve(__dirname, "..", "node_modules", "@lastui", "rocker", "platform"),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
