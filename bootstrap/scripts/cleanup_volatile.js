const path = require("path");

async function cleanupManifest(filename) {
  const { readFile, writeFile } = await import("../../cli/helpers/io.mjs");

  let changed = false;
  const manifestFile = path.resolve(__dirname, "..", "dll", filename);
  const manifest = JSON.parse(await readFile(manifestFile));

  for (const key in manifest.content) {
    if (key.startsWith("./node_modules/regenerator-runtime/")) {
      changed = true;
      delete manifest.content[key];
    }
    if (key.startsWith("./node_modules/@babel/runtime")) {
      changed = true;
      delete manifest.content[key];
    }
    if (key.startsWith("./node_modules/core-js")) {
      changed = true;
      delete manifest.content[key];
    }
    if (key.endsWith("tslib/tslib.es6.js")) {
      changed = true;
      delete manifest.content[key];
    }
  }
  if (changed) {
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  }
}

async function main(filename) {
  await cleanupManifest("bootstrap-prod-manifest.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
