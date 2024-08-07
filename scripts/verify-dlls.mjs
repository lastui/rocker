import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import glob from "glob";

async function verifyManifests(workspace) {
  const fileStream = new Readable({ objectMode: true });
  fileStream._read = () => {};

  glob(
    workspace + "*-manifest.json",
    {
      cwd: path.resolve(fileURLToPath(import.meta.url), "..", "..", workspace, "dll"),
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

  const polyfills = [
    "./node_modules/regenerator-runtime/",
    "./node_modules/@babel/runtime",
    "./node_modules/core-js",
    "./node_modules/tslib",
  ];

  for await (const filePath of fileStream) {
    const manifestFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", workspace, "dll", filePath);
    const manifest = JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" }));

    for (const entry in manifest.content) {
      if (entry.startsWith("dll-reference")) {
        continue;
      }

      if (!entry.startsWith("./node_modules")) {
        throw new AssertionError(`${filePath} contains wrongly linked reference ${entry}`);
      }
    }

    if (!filePath.startsWith(workspace + "-")) {
      continue;
    }

    let changed = false;

    for (const entry in manifest.content) {
      if (entry.startsWith("dll-reference")) {
        continue;
      }

      if (polyfills.some((item) => entry.indexOf(item) !== -1)) {
        changed = true;
        delete manifest.content[entry];
      }
    }

    if (changed) {
      await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
    }
  }
}

await verifyManifests("dependencies");
await verifyManifests("platform");
await verifyManifests("bootstrap");
