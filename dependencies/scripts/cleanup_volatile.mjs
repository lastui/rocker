import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

async function cleanupManifest(filename) {
  let changed = false;

  const manifestFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll", filename);
  const manifest = JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" }));

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
    await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  }
}

await cleanupManifest("dependencies-prod-manifest.json");
