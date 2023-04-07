import process from 'node:process';
import { fileURLToPath } from 'node:url';
import jest from "jest";
import path from 'node:path';

export async function run(options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const config = path.resolve(fileURLToPath(import.meta.url), "..", "..", "..", "jest", "index.js");

  await jest.run([
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
};
