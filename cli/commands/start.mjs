import process from "node:process";
import path from "node:path";
import colors from "ansi-colors";
import { setup, getStack } from "../helpers/webpack.mjs";

export const command = "start";

export const describe = "develop package";

export const builder = {};

export async function handler(options, cleanupHooks) {
  
  const packageName = path.basename(process.env.INIT_CWD);
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
  instance.startCallback((err) => {
    if (err) {
      callback(err);
    }
  });
  cleanupHooks.push(() => instance.close());
};
