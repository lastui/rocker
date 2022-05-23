exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const packageName = require('path').basename(process.env.INIT_CWD);
  const { setup, getStack } = require("../helpers/webpack.js");
  const callback = await setup(argv, packageName);
  const { config, webpack } = await getStack(packageName);

  webpack(config).run(callback);
};