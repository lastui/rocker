import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from "node:path";

const thisFile = fileURLToPath(import.meta.url)

async function ulinkDependenciesModules() {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules");
  await fs.unlink(targetPath)
}

async function unlinkDLL(...nodePath) {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", "@lastui", ...nodePath, "dll");
  await fs.unlink(targetPath);
}

async function unlinkModule(...nodePath) {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", ...nodePath);
  await fs.unlink(targetPath);
}

async function ulinkSelfAsModule() {
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", "@lastui", "rocker", "platform");
  await fs.unlink(targetPath);
  await fs.rm(path.dirname(path.dirname(targetPath)), { recursive: true, force: true });
}

await unlinkModule("core-js");
await unlinkDLL("dependencies");
await ulinkSelfAsModule();
await ulinkDependenciesModules();
