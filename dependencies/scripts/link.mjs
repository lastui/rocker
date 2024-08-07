import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const thisFile = fileURLToPath(import.meta.url);

async function linkDevModule(...nodePath) {
  const sourcePath = path.resolve(thisFile, "..", "..", "..", "node_modules", ...nodePath);
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", ...nodePath);
  try {
    await fs.unlink(targetPath);
  } catch (_error) {
    await fs.rm(targetPath, { recursive: true, force: true });
  }
  await fs.symlink(sourcePath, targetPath);
}

await linkDevModule("core-js");
await linkDevModule("tslib");
await linkDevModule("buffer");
await linkDevModule("ieee754");
