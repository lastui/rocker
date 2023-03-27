const path = require("path");
const { readFile, writeFile } = require("../../cli/helpers/io");

async function cleanupManifest(filename) {
  let changed = false;
  console.log(`Cleaning up ${filename} file`);
  const manifestFile = path.resolve(__dirname, "..", "dll", filename);
  const manifest = JSON.parse(await readFile(manifestFile));

  for (const key in manifest.content) {
    if (key.startsWith("./node_modules/@babel/runtime")) {
      changed = true;
      console.log(`dropping ${key} from ${filename}`);
      delete manifest.content[key];
    }
    if (key.startsWith("./node_modules/core-js")) {
      changed = true;
      console.log(`dropping ${key} from ${filename}`);
      delete manifest.content[key];
    }
  }
  if (changed) {
    console.log(`Patching ${filename} file`);
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
