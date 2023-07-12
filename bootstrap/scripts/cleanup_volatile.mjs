import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

async function cleanupManifest(filename) {
  let changed = false;

  const manifestFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll", filename);
  const manifest = JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" }));

  const polyfills = [
    "./node_modules/regenerator-runtime/",
    "./node_modules/@babel/runtime",
    "./node_modules/core-js",
    "tslib/tslib.es6.js",
  ];

  for (const key in manifest.content) {
    if (polyfills.includes(key)) {
      changed = true;
      delete manifest.content[key];
    }
  }
  if (changed) {
    await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
  }
}

await cleanupManifest("bootstrap-prod-manifest.json");
