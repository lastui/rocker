exports.command = "build";

exports.describe = "compile sources";

exports.builder = {};

exports.handler = async function (options, _cleanupHooks) {
  const path = await import("node:path");
  const packageName = path.basename(process.env.INIT_CWD);
  const { setup, getStack } = await import("../helpers/webpack.mjs");

  const callback = await setup(options);
  const { configs, webpack } = await getStack(options, packageName);

  await new Promise((resolve, _reject) => {
    webpack(configs).run((err, stats) => {
      callback(err, stats);
      resolve();
    });
  });
};
