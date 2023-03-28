#!/usr/bin/env node

const path = require("path");
const { clearDirectory, createSymlink, ensureDirectory } = require("../../cli/helpers/io");

async function main() {
  await clearDirectory(path.resolve(__dirname, "..", "node_modules"));
  await createSymlink(
    path.resolve(__dirname, "..", "..", "dependencies", "node_modules"),
    path.resolve(__dirname, "..", "node_modules"),
  );
  await clearDirectory(path.resolve(__dirname, "..", "node_modules", "@lastui"));
  await ensureDirectory(path.resolve(__dirname, "..", "node_modules", "@lastui"));
  await ensureDirectory(path.resolve(__dirname, "..", "node_modules", "@lastui", "rocker"));
  await createSymlink(
    path.resolve(__dirname, "..", "..", "dependencies"),
    path.resolve(__dirname, "..", "node_modules", "@lastui", "dependencies"),
  );
  await createSymlink(
    path.resolve(__dirname, "..", "..", "platform", "src"),
    path.resolve(__dirname, "..", "node_modules", "@lastui", "rocker", "platform"),
  );
  await createSymlink(
    path.resolve(__dirname, "..", "src"),
    path.resolve(__dirname, "..", "node_modules", "@lastui", "rocker", "bootstrap"),
  );
  await clearDirectory(path.resolve(__dirname, "..", "node_modules", "core-js"));
  await createSymlink(
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
