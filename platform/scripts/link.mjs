import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

const thisFile = fileURLToPath(import.meta.url);

async function linkDependenciesModules() {
  const sourcePath = path.resolve(thisFile, "..", "..", "..", "dependencies", "node_modules");
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules");
  try {
    await fs.unlink(targetPath);
  } catch (_error) {
    await fs.rm(targetPath, { recursive: true, force: true });
  }
  await fs.symlink(sourcePath, targetPath);
}

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

async function linkDLL(...nodePath) {
  const sourcePath = path.resolve(thisFile, "..", "..", "..", ...nodePath, "dll");
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", "@lastui", ...nodePath, "dll");
  try {
    await fs.unlink(targetPath);
  } catch (_error) {
    await fs.rm(targetPath, { recursive: true, force: true });
  }
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.symlink(sourcePath, targetPath);
  await fs.writeFile(path.resolve(path.dirname(targetPath), "index.js"), "");
}

async function linkSelfAsModule() {
  const sourcePath = path.resolve(thisFile, "..", "..", "src");
  const targetPath = path.resolve(thisFile, "..", "..", "node_modules", "@lastui", "rocker", "platform");
  try {
    await fs.unlink(targetPath);
  } catch (_error) {
    await fs.rm(targetPath, { recursive: true, force: true });
  }
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.symlink(sourcePath, targetPath);
}

await linkDependenciesModules();
await linkDevModule("core-js");
await linkDLL("dependencies");
await linkSelfAsModule();
