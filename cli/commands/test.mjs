export const command = "test";

export const describe = "run unit tests";

export const builder = {};

export async function handler(options, cleanupHooks) {
  const { run } = await import("../helpers/jest.mjs");

  await run(options);
};
