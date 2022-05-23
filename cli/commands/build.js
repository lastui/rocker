exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const packageName = require('path').basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(argv, packageName);
  const config = await getConfig(packageName);

  const server = require("webpack");

  server(config).run(callback);
};