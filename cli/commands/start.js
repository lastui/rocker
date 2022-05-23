exports.command = "start";

exports.describe = "develop package";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const colors = require("colors/safe");
  const packageName = require('path').basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(
    {
      ...argv,
      development: true,
    },
    packageName,
  );
  const { config, node_modules } = await getConfig(packageName);

  const devServerConfig = config.devServer;
  delete config.devServer;
    
  const compiler = require(`${node_modules}webpack`)(config, callback);
  compiler.hooks.invalid.tap("invalid", () => {
    console.log(colors.bold(`Compiling ${packageName}...`));
  });
  const server = require(`${node_modules}webpack-dev-server`);
  const instance = new server(devServerConfig, compiler);
  instance.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};