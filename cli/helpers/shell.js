exports.execShellCommand = async function (cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(stdout.trim());
      }
    });
  });
};