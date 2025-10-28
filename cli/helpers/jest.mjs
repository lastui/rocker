import process from "node:process";
import { fileURLToPath } from "node:url";
import { run as runJest } from "jest-cli";
import path from "node:path";

export async function run(options) {
  const config = path.resolve(fileURLToPath(import.meta.url), "..", "..", "..", "jest", "index.js");

  if (options.debug) {
    process.env.DEBUG_PRINT_LIMIT = Number.MAX_SAFE_INTEGER;

    const colors = (await import("ansi-colors")).default;
    console.log(colors.dim("Jest Configuration"));
  }

  await runJest([
    ...(process.stdout.isTTY ? ["--colors"] : []),
    "--passWithNoTests",
    "--injectGlobals",
    "--testLocationInResults",
    `--config=${config}`,
    ...(options.development ? ["--watchAll", "--coverage=false"] : []),
    ...(options.debug
      ? [
          "--debug",
          "--errorOnDeprecated",
          "--verbose",
          "--runInBand",
          "--detectOpenHandles",
          "--detectLeaks",
          "--logHeapUsage",
          "--bail",
        ]
      : ["--maxWorkers=50%", "--maxConcurency=10"]),
    ...options._,
  ]);
}
