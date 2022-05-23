exports.command = "build";

exports.describe = "bundle package";

exports.builder = {};

exports.handler = async function (argv, cleanupHooks) {
  const packageName = require('path').basename(process.env.INIT_CWD);
  const { setup, getConfig } = require("../helpers/webpack.js");
  const callback = await setup(argv, packageName);
  const { config, node_modules } = await getConfig(packageName);

  const server = require(`${node_modules}webpack`);

  server(config).run(callback);
};