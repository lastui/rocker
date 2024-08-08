import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "module";

const thisFile = fileURLToPath(import.meta.url);

async function generateSoftwareBillOfMaterials() {
  const legacyRequire = createRequire(thisFile);

  const manifest = legacyRequire("../dll/dependencies-prod-manifest.json");

  const lockfile = legacyRequire("../package-lock.json");

  const report = {};

  for (const key in manifest.content) {
    if (!key.startsWith("./node_modules")) {
      continue;
    }

    const parts = key.substring(15).split("/");
    const item = key[15] === "@" ? parts[0] + "/" + parts[1] : parts[0];

    if (item in report) {
      continue;
    }

    report[item] = "*";
  }

  for (const item in report) {
    const entry = lockfile.packages["node_modules/" + item];
    if (!entry) {
      delete report[item];
    } else {
      report[item] = entry.version;
    }
  }

  await fs.writeFile(path.resolve(thisFile, "..", "..", "sbom.json"), JSON.stringify(report, null, 2));
}

await generateSoftwareBillOfMaterials();
