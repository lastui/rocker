exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const path = await import("node:path");
  const { setup, getStack } = await import("../helpers/webpack.mjs");

  const packageName = path.basename(process.env.INIT_CWD);

  const callback = await setup(options, packageName);
  const { config, webpack } = await getStack(options, packageName);

  webpack(config).run(callback);
};
