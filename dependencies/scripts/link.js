#!/usr/bin/env node

const path = require("path");
const { clearDirectory, createSymlink } = require("../../cli/helpers/io");

async function main() {
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
