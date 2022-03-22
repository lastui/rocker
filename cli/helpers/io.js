const fs = require("fs");

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
