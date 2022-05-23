exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv) {
  let cleanupHooks = [];

  const path = require("path");

  if (argv.cwd) {
    process.env.INIT_CWD = path.resolve(argv.cwd)
  } else if (!process.env.INIT_CWD) {
    process.env.INIT_CWD = process.cwd();
  }

  cleanupHooks.push(() => process.exit(process.exitCode || 0));

  const signals = ["SIGINT", "SIGTERM"];
  signals.forEach(function (sig) {
    process.on(sig, () => {
      cleanupHooks.forEach((hook) => hook());
    });
  });

  const packageName = path.basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(argv, packageName);
  const config = await getConfig(packageName);

  const server = require("webpack");

  server(config).run(callback);
};