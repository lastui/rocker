import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import glob from "glob";

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

async function checkManifests(pattern) {
  const fileStream = new Readable({ objectMode: true });
  fileStream._read = () => {};

  glob(
    pattern,
    {
      cwd: path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll"),
      ignore: [],
    },
    (error, files) => {
      if (error) {
        fileStream.emit("error", error);
        return;
      }
      files.forEach((file) => {
        fileStream.push(file);
      });
      fileStream.push(null);
    },
  );

  for await (const filePath of fileStream) {
    const manifestFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll", filePath);
    const manifest = JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" }));

    for (const entry in manifest.content) {
      if (entry.startsWith("dll-reference")) {
        continue;
      }
      if (!entry.startsWith("./node_modules")) {
        throw new AssertionError(`${filename} contains wrongly linked reference ${entry}`);
      }
    }
  }
}

await cleanupManifest("dependencies-prod-manifest.json");

await checkManifests("dependencies*-manifest.json");
