import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import webpack from "webpack";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import types from "@babel/types";

process.env.INIT_CWD = path.resolve(fileURLToPath(import.meta.url), "..", "..");

const development = process.env.NODE_ENV === "development";

const config = (await import("../webpack.config.js")).default;
const dllConfig = (await import("../../webpack/config/dll/index.js")).default;
const command = await import("../../cli/commands/build.js");

function inferPackageFromImport(knownPackages, importPath) {
  let result = "";
  for (const knownPackage of knownPackages) {
    if (importPath.startsWith(`./node_modules/${knownPackage}/`) && knownPackage.length > result) {
      result = knownPackage;
    }
  }
  if (result.length > 0) {
    return result;
  }
  return importPath.split("/")[2];
}

function cacheKeyFactory(chunk) {
  return function (item) {
    return `${chunk}_${item.replaceAll("/", "-").replaceAll("@", "-").replaceAll("-", "_")}`;
  };
}

async function patchIndex(allExports) {
  const indexFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", "index.js");

  const indexSource = await fs.readFile(indexFile, { encoding: "utf8" });

  const ast = parser.parse(indexSource, { sourceType: "module" });

  const modifiedIndexFile = traverse.default(ast, {
    IfStatement(path) {
      if (development) {
        path.replaceWith(
          types.ifStatement(
            path.node.test,
            types.blockStatement([
              types.expressionStatement(
                types.assignmentExpression(
                  path.node.consequent.body[0].expression.operator,
                  path.node.consequent.body[0].expression.left,
                  types.arrayExpression(allExports.map(types.stringLiteral)),
                ),
              ),
            ]),
            path.node.alternate,
          ),
        );
      } else {
        path.replaceWith(
          types.ifStatement(
            path.node.test,
            path.node.consequent,
            types.blockStatement([
              types.expressionStatement(
                types.assignmentExpression(
                  path.node.alternate.body[0].expression.operator,
                  path.node.alternate.body[0].expression.left,
                  types.arrayExpression(allExports.map(types.stringLiteral)),
                ),
              ),
            ]),
          ),
        );
      }
      path.stop();
    },
  });

  await fs.writeFile(indexFile, generate.default(ast, { compact: false, concise: true }, indexSource).code);
}

function generateDllConfig(name, provides, references) {
  return {
    ...dllConfig,
    name,
    dependencies: [...(dllConfig.dependencies ?? []), ...references],
    entry: { [name]: provides },
    output: {
      ...dllConfig.output,
      library: {
        ...dllConfig.output.library,
        type: "var",
      },
    },
    plugins: [
      ...dllConfig.plugins,
      ...references.map(
        (reference) =>
          new webpack.DllReferencePlugin({
            manifest: path.resolve(
              fileURLToPath(import.meta.url),
              "..",
              "..",
              "dll",
              `${reference}-${development ? "dev" : "prod"}-manifest.json`,
            ),
            sourceType: "var",
            context: process.env.INIT_CWD,
          }),
      ),
    ],
  };
}

async function processChunk(chunk) {
  const resultingDlls = [];

  const toCacheKey = cacheKeyFactory(chunk);

  const entries = config.entry[chunk].map(toCacheKey).flat();

  // INFO compile all the entries mentioned in chunk into their own DLLs
  const nodeMapping = {};

  const directEntries = {};

  for (const entry of config.entry[chunk]) {
    const cacheKey = toCacheKey(entry);
    nodeMapping[cacheKey] = { entry };
    directEntries[cacheKey] = [entry];
  }

  await command.handler({ development, config: Object.assign({}, dllConfig, { entry: directEntries }) }, []);

  for (const leaf in nodeMapping) {
    const manifestFile = path.resolve(
      fileURLToPath(import.meta.url),
      "..",
      "..",
      "dll",
      `${leaf}-${development ? "dev" : "prod"}-manifest.json`,
    );

    nodeMapping[leaf].provides = Object.keys(JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" })).content);
  }

  // INFO compile all the entries used directly or transitively in chunk into their own DLLs
  const allUsedPackages = {};

  for (const cacheKey in nodeMapping) {
    for (const provision of nodeMapping[cacheKey].provides) {
      const packageName = inferPackageFromImport(entries, provision);
      if (!allUsedPackages[packageName]) {
        allUsedPackages[packageName] = [];
      }
      if (!allUsedPackages[packageName].includes(provision)) {
        allUsedPackages[packageName].push(provision);
      }
    }
  }

  const transitiveEntries = {};

  for (const entry in allUsedPackages) {
    const cacheKey = toCacheKey(entry);
    if (!nodeMapping[cacheKey]) {
      nodeMapping[cacheKey] = { entry };
    }
    transitiveEntries[cacheKey] = allUsedPackages[entry];
  }

  await command.handler({ development, config: Object.assign({}, dllConfig, { entry: transitiveEntries }) }, []);

  // INFO clean all intermediate DLLs and their manifests
  for (const leaf in nodeMapping) {
    const manifestFile = path.resolve(
      fileURLToPath(import.meta.url),
      "..",
      "..",
      "dll",
      `${leaf}-${development ? "dev" : "prod"}-manifest.json`,
    );
    const dllFile = path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll", `${leaf}.dll${development ? "" : ".min"}.js`);

    nodeMapping[leaf].provides = Object.keys(JSON.parse(await fs.readFile(manifestFile, { encoding: "utf8" })).content);

    await fs.rm(manifestFile, { recursive: false, force: true });
    await fs.rm(dllFile, { recursive: false, force: true });
  }

  // INFO generate map of package to import provisions
  const provisionMap = (function () {
    const result = {};
    for (const cacheKey in nodeMapping) {
      for (const provision of nodeMapping[cacheKey].provides) {
        const packageName = inferPackageFromImport(entries, provision);
        if (!result[packageName]) {
          result[packageName] = [];
        }
        if (!result[packageName].includes(provision)) {
          result[packageName].push(provision);
        }
      }
    }
    return result;
  })();

  // INFO generate dependency graph of packages, merge circular dependencies into one package
  const dependencyGraph = (function () {
    const result = {};
    for (const leaf in nodeMapping) {
      for (const provision of nodeMapping[leaf].provides) {
        const packageName = inferPackageFromImport(entries, provision);
        if (!result[nodeMapping[leaf].entry]) {
          result[nodeMapping[leaf].entry] = [];
        }
        if (!result[packageName]) {
          result[packageName] = [];
        }
        if (!result[nodeMapping[leaf].entry].includes(packageName) && nodeMapping[leaf].entry !== packageName) {
          result[nodeMapping[leaf].entry].push(packageName);
        }
      }
    }

    const packagesToMerge = [];

    for (const item in result) {
      for (const requirement of result[item]) {
        if (result[requirement].includes(item)) {
          packagesToMerge.push([item, requirement]);
        }
      }
    }

    const packagesToDelete = [];

    for (const [left, right] of packagesToMerge) {
      if (packagesToDelete.includes(left)) {
        continue;
      }

      const union = [];

      for (const addition of result[left]) {
        if (addition === left) {
          continue;
        }
        if (addition === right) {
          continue;
        }
        if (!union.includes(addition)) {
          union.push(addition);
        }
      }

      result[left] = union;

      if (!packagesToDelete.includes(right)) {
        packagesToDelete.push(right);
      }

      for (const provision of provisionMap[right]) {
        if (!provisionMap[left].includes(provision)) {
          provisionMap[left].push(provision);
        }
      }

      for (const item in result) {
        if (result[item].includes(right)) {
          result[item] = result[item].filter((dependency) => dependency !== right);
          if (!result[item].includes(left)) {
            result[item].push(left);
          }
        }
      }
    }

    for (const deletion of packagesToDelete) {
      delete result[deletion];
    }

    return result;
  })();

  // INFO generate order of DLL compilation
  const compilationOrder = (function () {
    const result = [];
    const visited = {};

    for (const packageName in dependencyGraph) {
      if (!visited[packageName]) {
        walk(packageName, dependencyGraph[packageName]);
      }
    }

    function walk(packageName, requires) {
      visited[packageName] = true;
      for (const dependency of requires) {
        if (!visited[dependency]) {
          walk(dependency, dependencyGraph[dependency]);
        }
      }
      result.push(packageName);
    }
    return result.filter((item) => Boolean(provisionMap[item]));
  })();

  // INFO generate multiconfig compilation for webpack
  const strategy = [
    ...compilationOrder.map((entry) =>
      generateDllConfig(toCacheKey(entry), provisionMap[entry], dependencyGraph[entry].map(toCacheKey)),
    ),
    generateDllConfig(chunk, [...new Set(Object.values(allUsedPackages).flat())], compilationOrder.map(toCacheKey)),
  ];

  await command.handler({ development, config: strategy }, []);

  for (const entry of compilationOrder) {
    const item = toCacheKey(entry);
    if (!resultingDlls.includes(item)) {
      resultingDlls.push(item);
    }
  }

  resultingDlls.push(chunk);

  return resultingDlls;
}

const allDlls = [];

// INFO for all chunks generate DLLs
for (const chunk in config.entry) {
  const result = await processChunk(chunk);
  for (const generatedDll of result) {
    if (!allDlls.includes(generatedDll)) {
      allDlls.push(generatedDll);
    }
  }
}

// INFO patch branch in index.js to export all DLLs inorder for synchronous requirement in webpack configurations
await patchIndex(allDlls);
