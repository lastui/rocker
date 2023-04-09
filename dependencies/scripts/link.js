#!/usr/bin/env node

const path = require("path");

async function main() {
  const { clearDirectory, createSymlink } = await import("../../cli/helpers/io.mjs");

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
