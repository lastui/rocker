const path = require("path");
const { readFile, writeFile } = require("../../cli/helpers/io");

async function main() {
  const manifestFile = path.resolve(__dirname, "..", "dll", "platform-prod-manifest.json");
  const manifest = JSON.parse(await readFile(manifestFile));

  for (const key in manifest.content) {
    if (key.startsWith("./node_modules/@babel/runtime")) {
      delete manifest.content[key];
    }
  }

  await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
