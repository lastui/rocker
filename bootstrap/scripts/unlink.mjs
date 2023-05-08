import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const thisFile = fileURLToPath(import.meta.url);

async function ulinkDependenciesModules() {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", "@lastui");
  await fs.rm(targetPath, { recursive: true, force: true });
  await fs.unlink(path.dirname(targetPath));
}

async function unlinkDLL(...nodePath) {
  await unlinkModule("@lastui", ...nodePath, "dll");
}

async function unlinkModule(...nodePath) {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", ...nodePath);
  await fs.unlink(targetPath);
}

await unlinkModule("@lastui", "rocker", "bootstrap");
await unlinkModule("core-js");
await unlinkDLL("dependencies");
await unlinkDLL("rocker", "platform");
await ulinkDependenciesModules();
