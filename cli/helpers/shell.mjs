import process from "node:process";
import { exec } from "node:child_process";

export async function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { env: process.env, maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(stdout.trim());
      }
    });
  });
}
