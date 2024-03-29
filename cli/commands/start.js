exports.command = "start";

exports.describe = "develop package";

exports.builder = {};

exports.handler = async function (options, cleanupHooks) {
  const path = await import("node:path");
  const colors = (await import("ansi-colors")).default;
  const { setup, getStack } = await import("../helpers/webpack.mjs");

  const packageName = path.basename(process.env.INIT_CWD);
  const callback = await setup({ ...options, development: true });
  const { configs, webpack, DevServer } = await getStack(options, packageName);

  for (const config of configs) {
    const devServerConfig = config.devServer;
    delete config.devServer;

    const compiler = webpack(config, callback);
    if (!options.quiet) {
      compiler.hooks.invalid.tap("invalid", () => {
        console.log(colors.bold(`Compiling ${packageName}...`));
      });
    }
    const instance = new DevServer(devServerConfig, compiler);
    instance.startCallback((err) => {
      if (err) {
        callback(err);
      }
    });
    cleanupHooks.push(() => instance.close());
  }
};
