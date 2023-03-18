exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const packageName = require("path").basename(process.env.INIT_CWD);
  const { setup, getStack } = require("../helpers/webpack.js");
  const callback = await setup(options, packageName);
  const { config, webpack } = await getStack(options, packageName);

  webpack(config).run(callback);
};
