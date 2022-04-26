const fs = require("fs");
const path = require("path");

exports.fileExists = async function (nodePath) {
  return new Promise(function (resolve, reject) {
    fs.lstat(nodePath, function (err, stats) {
      if (err == null) {
        return resolve(!stats.isDirectory());
      } else if (err.code === "ENOENT") {
        return resolve(false);
      } else {
        return reject(err);
      }
    });
  });
};

exports.createSymlink = async function (source, target) {
  return new Promise((resolve, reject) => {
    fs.lstat(source, function (err, stats) {
      if (err == null) {
        if (stats.isDirectory() && !stats.isSymbolicLink()) {
          fs.symlink(source, target, "dir", function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(target);
          });
        } else {
          fs.symlink(source, target, "file", function (err) {
            if (err) {
              return reject(err);
            }
            return resolve(target);
          });
        }
      } else {
        return reject(err);
      }
    });
  });
};

exports.ensureDirectory = async function (nodePath) {
  return new Promise((resolve, reject) => {
    fs.stat(nodePath, function (err, stats) {
      if (err == null) {
        return resolve();
      } else if (err.code === "ENOENT") {
        fs.mkdir(nodePath, function (ok, error) {
          if (error) {
            return reject(error);
          } else {
            return resolve();
          }
        });
      } else {
        return reject(err);
      }
    });
  });
};

exports.clearDirectory = async function (nodePath) {
  const unlink = (item) =>
    new Promise((resolve, reject) => {
      switch (item.action) {
        case "unlink": {
          fs.unlink(item.path, (err) =>
            err ? reject(err) : resolve()
          );
          break;
        }
        case "rm": {
          fs.rm(item.path, { force: true }, (err) =>
            err ? reject(err) : resolve()
          );
          break;
        }
        case "rmdir": {
          fs.rm(
            item.path,
            { recursive: true, force: true },
            (err) => (err ? reject(err) : resolve())
          );
          break;
        }
      }
    });

  const nodes = await walkRecursive(nodePath);
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
  const work = nodes.map((item) => unlink(item));
  await Promise.all(work);
};

async function walkRecursive(nodePath) {
  const flatten = (ary) =>
    ary.reduce(
      (a, b) => (Array.isArray(b) ? a.concat(flatten(b)) : a.concat(b)),
      []
    );

  const work = await new Promise((resolve, reject) => {
    fs.lstat(nodePath, function (err, stats) {
      if (err == null) {
        if (stats.isDirectory()) {
          fs.readdir(nodePath, function (err, files) {
            if (err) {
              return reject(err);
            }
            let step = files.map((node) =>
              walkRecursive(path.join(nodePath, node))
            );
            if (stats.isSymbolicLink()) {
              step.push({
                path: nodePath,
                action: "unlink",
              });
            }
            step.push({
              path: nodePath,
              action: "rmdir",
            });
            return resolve(Promise.all(step));
          });
        } else {
          return resolve([
            {
              path: nodePath,
              action: "unlink",
            },
          ]);
        }
      } else if (err.code === "ENOENT") {
        return resolve([]);
      } else {
        return reject(err);
      }
    });
  });
  const slice = await Promise.all(flatten(work));
  return slice;
}
