exports.command = "start";

exports.describe = "develop package";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const colors = require("ansi-colors");
  const packageName = require("path").basename(process.env.INIT_CWD);
  const { setup, getStack } = require("../helpers/webpack.js");
  const callback = await setup(
    {
      ...argv,
      development: true,
    },
    packageName,
  );
  const { config, webpack, DevServer } = await getStack(packageName);

  const devServerConfig = config.devServer;
  delete config.devServer;

  const compiler = webpack(config, callback);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log(colors.bold(`Compiling ${packageName}...`));
  });
  const instance = new DevServer(devServerConfig, compiler);
  instance.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};
