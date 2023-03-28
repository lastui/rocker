const path = require("path");
const { readFile, writeFile } = require("../../cli/helpers/io");

async function cleanupManifest(filename) {
  let changed = false;
  const manifestFile = path.resolve(__dirname, "..", "dll", filename);
  const manifest = JSON.parse(await readFile(manifestFile));

  for (const key in manifest.content) {
    if (key.startsWith("./node_modules/regenerator-runtime/runtime.js")) {
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
  }
  if (changed) {
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  }
}

async function main(filename) {
  await cleanupManifest("platform-prod-manifest.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
