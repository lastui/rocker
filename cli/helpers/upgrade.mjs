import semver from "semver";

import process from "node:process";
import path from "node:path";
import colors from "ansi-colors";
import npmFetch from "npm-registry-fetch";
import { execShellCommand } from "./shell.mjs";
import { readFile } from "./io.mjs";

function longestCommonPrefix(a, b) {
  let i = 0;
  while (a[i] && b[i] && a[i] === b[i]) {
    i++;
  }
  return i;
}

async function getCurrentVersion(name) {
  const result = JSON.parse(await readFile(path.resolve(process.env.INIT_CWD, "package.json")));

  if (result.dependencies && name in result.dependencies) {
    // TODO use semver min version
    return result.dependencies[name].replace(/[^\d.]/g, "");
  }

  if (result.devDependencies && name in result.devDependencies) {
    // TODO use semver min version
    return result.devDependencies[name].replace(/[^\d.]/g, "");
  }

  return null;
}

async function getLatestVersion(name) {
  const registry = npmFetch.pickRegistry(name, {});
  const url = new URL(encodeURIComponent(name), registry.endsWith("/") ? registry : `${registry}/`);

  const stream = npmFetch.json.stream(url.href, "$*", {
    headers: {
      "user-agent": "node/${process.version}",
      accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
      spec: name,
      offline: false,
    },
  });

  const fragment = { name };
  const fields = ["versions"];

  for await (const { key, value } of stream) {
    if (fields.includes(key)) {
      fragment[key] = value;
      if (Object.keys(fragment).length === fields.length + 1) {
        break;
      }
    }
  }

  let newest = null;

  for (const version in fragment.versions) {
    const item = fragment.versions[version];

    const wantedEngine = item?.engines?.node;

    if (!wantedEngine || semver.satisfies(process.version, wantedEngine)) {
      if (!newest || semver.gt(version, newest)) {
        newest = version;
      }
    }
  }

  return newest;
}

export async function run(options) {
  let changed = false;

  const scheduled = ["@lastui/dependencies", "@lastui/rocker"];

  for (const item of scheduled) {
    const current = await getCurrentVersion(item);
    if (!current) {
      continue;
    }

    const latest = await getLatestVersion(item);

    if (!latest) {
      continue;
    }

    if (current === latest) {
      continue;
    }

    changed = true;

    const idx = longestCommonPrefix(latest, current);

    console.log(`Upgrading ${colors.bold.green(item)} ${current.substring(0, idx)}${colors.cyan(latest.substring(idx))}`);

    await execShellCommand(
      `npm --prefix=${process.env.INIT_CWD} i --no-progress --package-lock-only --save-exact --no-fund --no-audit ${item}@${latest}`,
    );
  }

  if (!changed) {
    console.log(colors.green("Up to date"));
    return;
  }

  console.log(colors.bold.green("Installing upgrade"));
  await execShellCommand(`npm --prefix=${process.env.INIT_CWD} ci --no-progress --ci --no-fund`);
}
