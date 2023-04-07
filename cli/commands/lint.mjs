export const command = "lint";

export const describe = "lint sources";

export const builder = {};

export async function handler(options, cleanupHooks) {
  const { run } = await import("../helpers/lint-stream.mjs");

  await run(options);
};
