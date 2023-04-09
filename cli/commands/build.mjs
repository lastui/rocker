import path from "node:path";
import { setup, getStack } from "../helpers/webpack.mjs";

export const command = "build";

export const describe = "bundle package";

export const builder = {};

export async function handler(options, cleanupHooks) {
  const packageName = path.basename(process.env.INIT_CWD);
  
  const callback = await setup(options, packageName);
  const { config, webpack } = await getStack(options, packageName);

  webpack(config).run(callback);
};
