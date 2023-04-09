import { run as runLintStream } from "../helpers/lint-stream.mjs";

export const command = "lint";

export const describe = "lint sources";

export const builder = {};

export async function handler(options, cleanupHooks) {
  await runLintStream(options);
};
