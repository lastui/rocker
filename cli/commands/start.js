exports.command = "start";

exports.describe = "develop package";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const colors = require("ansi-colors");
  const packageName = require("path").basename(process.env.INIT_CWD);
  const { setup, getStack } = require("../helpers/webpack.js");
  const callback = await setup(
    {
      ...options,
      development: true,
    },
    packageName,
  );
  const { config, webpack, DevServer } = await getStack(options, packageName);

  const devServerConfig = config.devServer;
  delete config.devServer;

  const compiler = webpack(config, callback);
  if (!options.quiet) {
    compiler.hooks.invalid.tap("invalid", () => {
      console.log(colors.bold(`Compiling ${packageName}...`));
    });
  }
  const instance = new DevServer(devServerConfig, compiler);
  instance.startCallback(err => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};
