import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from "node:path";

const thisFile = fileURLToPath(import.meta.url)

async function unlinkModule(...nodePath) {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", ...nodePath);
  await fs.unlink(targetPath);
}

await unlinkModule("core-js");