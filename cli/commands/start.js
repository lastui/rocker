exports.command = "start";

exports.describe = "develop package";

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

  const colors = require("colors/safe");
  const packageName = path.basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(
    {
      ...argv,
      development: true,
    },
    packageName,
  );
  const config = await getConfig(packageName);

  const devServerConfig = config.devServer;
  delete config.devServer;
  const compiler = require("webpack")(config, callback);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log(colors.bold(`Compiling ${packageName}...`));
  });
  const server = require("webpack-dev-server");
  const instance = new server(devServerConfig, compiler);
  instance.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};