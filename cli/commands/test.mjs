import { run as runJest } from "../helpers/jest.mjs";

export const command = "test";

export const describe = "run unit tests";

export const builder = {};

export async function handler(options, cleanupHooks) {
  await runJest(options);
};
