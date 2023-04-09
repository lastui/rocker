import fs from 'node:fs/promises';
import path from "node:path";

export async function readFile(nodePath) {
  return await fs.readFile(nodePath, { encoding: 'utf8' });
};

export async function writeFile(nodePath, data) {
  try {
    await fs.writeFile(nodePath, data);
  } catch(error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    await ensureDirectory(path.dirname(nodePath));
    await fs.writeFile(nodePath, data);
  }
};

export async function copyFile(source, destination) {
  await fs.copyFile(source, destination, constants.COPYFILE_FICLONE)
};

export async function fileExists(nodePath) {
  try {
    const stats = await fs.lstat(nodePath);
    return !stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export async function directoryExists(nodePath) {
  try {
    const stats = await fs.lstat(nodePath);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export async function createSymlink(source, target) {
  await fs.symlink(source, target);
};

export async function ensureDirectory(nodePath) {
  await fs.mkdir(nodePath, { recursive: true });
};

export async function clearDirectory(nodePath) {  
  const clear = async (item) => {
    switch (item.action) {
      case "unlink": {
        await fs.unlink(item.path);
        break;
      }
      case "rm": {
        await fs.rm(item.path, { force: true });
        break;
      }
      case "rmdir": {
        await fs.rm(item.path, { recursive: true, force: true });
        break;
      }
    }
  }

  const nodes = [];

  const walk = async (currentPath) => {
    try {
      const stats = await fs.lstat(currentPath);
      if (!stats.isDirectory()) {
        nodes.push({
          path: currentPath,
          action: "unlink",
        })
        return;
      }

      const files = await fs.readdir(currentPath);

      await Promise.all(files.map((childPath) => walk(path.join(currentPath, childPath))))

      if (stats.isSymbolicLink()) {
        nodes.push({
          path: currentPath,
          action: "unlink",
        });
      }
      nodes.push({
        path: currentPath,
        action: "rmdir",
      });
    } catch(error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  };

  await walk(nodePath);

  nodes.sort((a, b) => {
    const nameDiff = a.path.localeCompare(b.path);
    if (nameDiff !== 0) {
      return nameDiff;
    }
    if (a.action === b.action) {
      return 0;
    }
    if (a.action === "unlink" && b.action !== "unlink") {
      return -1;
    }
    if (b.action === "unlink" && a.action !== "unlink") {
      return 1;
    }
    return 0;
  });

  await Promise.all(nodes.map(clear));
};
