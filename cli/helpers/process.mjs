import process from "node:process";
import path from "node:path";
import { directoryExists } from "./io.mjs";

async function patchCwd(options) {
  if (options.cwd) {
    const requested = path.resolve(options.cwd);
    const exists = await directoryExists(requested);
    if (exists) {
      process.env.INIT_CWD = requested;
    }
  }
  if (!process.env.INIT_CWD) {
    process.env.INIT_CWD = process.cwd();
  }
}

async function patchColors(options) {
  const isTTY = process.stdout.isTTY ? "1" : "0";
  process.env.FORCE_COLOR = isTTY;
  if (process.env.COLOR) {
    process.env.COLOR = isTTY;
  }
  if (process.env.COLOR) {
    process.env.COLOR = isTTY;
  }
}

export function envelope(command) {
  return {
    command: command.command,
    describe: command.describe,
    builder: command.builder,
    async handler(options) {
      await Promise.all([patchCwd(options), patchColors(options)]);

      const cleanupHooks = [];

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      for (const signal in ["SIGINT", "SIGTERM"]) {
        process.on(signal, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      }

      await command.handler(
        {
          ...options,
          _: options._.filter((item) => item !== command.command),
        },
        cleanupHooks,
      );
    },
  };
};
