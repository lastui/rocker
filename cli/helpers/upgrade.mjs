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
    return semver.minVersion(result.dependencies[name]).version;
  }
  if (result.devDependencies && name in result.devDependencies) {
    return semver.minVersion(result.devDependencies[name]).version;
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

  const versions = {};

  for await (const { key, value } of stream) {
    if (key === "versions") {
      Object.assign(versions, value);
      break;
    }
  }

  let newest = null;

  for (const version in versions) {
    const wantedEngine = versions[version].engines?.node;

    if (wantedEngine && !semver.satisfies(process.version, wantedEngine)) {
      continue;
    }

    if (!newest || semver.gt(version, newest)) {
      newest = version;
    }
  }

  return newest;
}

export async function run(options) {
  const outdated = [];

  for (const name of ["@lastui/dependencies", "@lastui/rocker"]) {
    const current = await getCurrentVersion(name);
    if (!current) {
      continue;
    }

    const latest = await getLatestVersion(name);

    if (!latest) {
      continue;
    }

    if (semver.gt(latest, current)) {
      outdated.push({ name, current, latest });
    }
  }

  if (outdated.length === 0) {
    console.log(colors.green("Up to date"));
    return;
  }

  for (const { name, current, latest } of outdated) {
    const idx = longestCommonPrefix(latest, current);

    console.log(`Bumping ${colors.cyan.bold(name)} to ${current.substring(0, idx)}${colors.cyan(latest.substring(idx))}`);

    await execShellCommand(
      `npm --prefix=${process.env.INIT_CWD} i --no-progress --package-lock-only --save-exact --no-fund --no-audit ${name}@${latest}`,
    );
  }

  console.log(colors.green("Installing upgrade"));
  await execShellCommand(`npm --prefix=${process.env.INIT_CWD} ci --no-progress --ci --no-fund`);
}
