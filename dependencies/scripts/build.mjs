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

const dllConfig = (await import("../../webpack/config/dll/index.js")).default;
const config = (await import("../webpack.config.js")).default;
const command = await import("../../cli/commands/build.js");

function toCacheKey(chunk, item) {
  return `${chunk}_${item.replaceAll("/", "-").replaceAll("@", "-").replaceAll("-", "_")}`;
}

function generateDllConfig(name, provides, references, sourceType) {
  const plugins = references.map(
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
  );

  return {
    ...dllConfig,
    name,
    dependencies: [...(dllConfig.dependencies ?? []), ...references],
    entry: { [name]: provides },
    output: {
      ...dllConfig.output,
      library: {
        ...dllConfig.output.library,
        type: sourceType,
      },
    },
    plugins: [...dllConfig.plugins, ...plugins],
  };
}

const allDlls = [];

for (const chunk in config.entry) {
  const nodeMapping = {};

  await (async function () {
    const directEntries = {};

    for (const entry of config.entry[chunk]) {
      const cacheKey = toCacheKey(chunk, entry);
      nodeMapping[cacheKey] = {
        entry,
        chunk,
      };
      directEntries[cacheKey] = [entry];
    }

    await command.handler({ development, config: Object.assign({}, dllConfig, { entry: directEntries }) }, []);
  })();

  for (const leaf in nodeMapping) {
    nodeMapping[leaf].provides = Object.keys(
      JSON.parse(
        await fs.readFile(
          path.resolve(
            fileURLToPath(import.meta.url),
            "..",
            "..",
            "dll",
            `${leaf}-${development ? "dev" : "prod"}-manifest.json`,
          ),
          { encoding: "utf8" },
        ),
      ).content,
    );
  }

  const entries = config.entry[chunk].map((entry) => toCacheKey(chunk, entry)).flat();

  const allUsedPackages = {};

  for (const cacheKey in nodeMapping) {
    for (const provision of nodeMapping[cacheKey].provides) {
      let candidate = "";
      for (const entry of entries) {
        if (provision.startsWith(`./node_modules/${entry}/`) && entry.length > candidate) {
          candidate = entry;
        }
      }
      if (candidate.length === 0) {
        candidate = provision.split("/")[2];
      }
      const packageName = candidate;

      if (!allUsedPackages[packageName]) {
        allUsedPackages[packageName] = [];
      }

      if (!allUsedPackages[packageName].includes(provision)) {
        allUsedPackages[packageName].push(provision);
      }
    }
  }

  await (async function () {
    const transitiveEntries = {};

    for (const entry in allUsedPackages) {
      const cacheKey = toCacheKey(chunk, entry);
      if (!nodeMapping[cacheKey]) {
        nodeMapping[cacheKey] = {
          entry,
          chunk,
        };
      }
      transitiveEntries[cacheKey] = allUsedPackages[entry];
    }

    await command.handler({ development, config: Object.assign({}, dllConfig, { entry: transitiveEntries }) }, []);
  })();

  for (const leaf in nodeMapping) {
    nodeMapping[leaf].provides = Object.keys(
      JSON.parse(
        await fs.readFile(
          path.resolve(
            fileURLToPath(import.meta.url),
            "..",
            "..",
            "dll",
            `${leaf}-${development ? "dev" : "prod"}-manifest.json`,
          ),
          { encoding: "utf8" },
        ),
      ).content,
    );

    await fs.rm(
      path.resolve(
        fileURLToPath(import.meta.url),
        "..",
        "..",
        "dll",
        `${leaf}-${development ? "dev" : "prod"}-manifest.json`,
      ),
      { recursive: false, force: true },
    );
    await fs.rm(
      path.resolve(fileURLToPath(import.meta.url), "..", "..", "dll", `${leaf}.dll${development ? "" : ".min"}.js`),
      { recursive: false, force: true },
    );
  }

  const provisionMap = {};

  for (const cacheKey in nodeMapping) {
    for (const provision of nodeMapping[cacheKey].provides) {
      let candidate = "";
      for (const entry of entries) {
        if (provision.startsWith(`./node_modules/${entry}/`) && entry.length > candidate) {
          candidate = entry;
        }
      }
      if (candidate.length === 0) {
        candidate = provision.split("/")[2];
      }
      const packageName = candidate;

      if (!provisionMap[packageName]) {
        provisionMap[packageName] = [];
      }
      if (!provisionMap[packageName].includes(provision)) {
        provisionMap[packageName].push(provision);
      }
    }
  }

  const dependencyGraph = {};

  for (const leaf in nodeMapping) {
    for (const provision of nodeMapping[leaf].provides) {
      let candidate = "";
      for (const entry of entries) {
        if (provision.startsWith(`./node_modules/${entry}/`) && entry.length > candidate) {
          candidate = entry;
        }
      }
      if (candidate.length === 0) {
        candidate = provision.split("/")[2];
      }
      const packageName = candidate;
      if (!dependencyGraph[nodeMapping[leaf].entry]) {
        dependencyGraph[nodeMapping[leaf].entry] = [];
      }
      if (!dependencyGraph[packageName]) {
        dependencyGraph[packageName] = [];
      }
      if (!dependencyGraph[nodeMapping[leaf].entry].includes(packageName) && nodeMapping[leaf].entry !== packageName) {
        dependencyGraph[nodeMapping[leaf].entry].push(packageName);
      }
    }
  }

  //const packagesMarkedForMerge = {}
  const packagesToMerge = [];

  for (const item in dependencyGraph) {
    for (const requirement of dependencyGraph[item]) {
      if (dependencyGraph[requirement].includes(item)) {
        packagesToMerge.push([item, requirement]);
      }
    }
  }

  for (const toMerge of packagesToMerge) {
    if (!dependencyGraph[toMerge[0]]) {
      continue;
    }

    const union = [];

    for (const addition of dependencyGraph[toMerge[0]]) {
      if (addition === toMerge[0]) {
        continue;
      }
      if (addition === toMerge[1]) {
        continue;
      }
      if (!union.includes(addition)) {
        union.push(addition);
      }
    }

    dependencyGraph[toMerge[0]] = union;
    delete dependencyGraph[toMerge[1]];

    for (const provision of provisionMap[toMerge[1]]) {
      if (!provisionMap[toMerge[0]].includes(provision)) {
        provisionMap[toMerge[0]].push(provision);
      }
    }

    for (const item in dependencyGraph) {
      if (dependencyGraph[item].includes(toMerge[1])) {
        dependencyGraph[item] = dependencyGraph[item].filter((dependency) => dependency !== toMerge[1]);
        if (!dependencyGraph[item].includes(toMerge[0])) {
          dependencyGraph[item].push(toMerge[0]);
        }
      }
    }
  }

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

  const strategy = [
    ...compilationOrder.map((entry) =>
      generateDllConfig(
        toCacheKey(chunk, entry),
        provisionMap[entry],
        dependencyGraph[entry].map((item) => toCacheKey(chunk, item)),
        "var",
      ),
    ),
    generateDllConfig(
      chunk,
      [...new Set(Object.values(allUsedPackages).flat())],
      compilationOrder.map((item) => toCacheKey(chunk, item)),
      "var",
    ),
  ];

  await command.handler({ development, config: strategy }, []);

  for (const entry of compilationOrder) {
    const item = {
      name: toCacheKey(chunk, entry),
      type: "var",
    };
    if (!allDlls.includes(item)) {
      allDlls.push(item);
    }
  }

  allDlls.push({
    name: chunk,
    type: "var",
  });
}

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
                types.arrayExpression(
                  allDlls.map((entry) =>
                    types.objectExpression([
                      types.objectProperty(types.identifier("name"), types.stringLiteral(entry.name)),
                      types.objectProperty(types.identifier("type"), types.stringLiteral(entry.type)),
                    ]),
                  ),
                ),
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
                types.arrayExpression(
                  allDlls.map((entry) =>
                    types.objectExpression([
                      types.objectProperty(types.identifier("name"), types.stringLiteral(entry.name)),
                      types.objectProperty(types.identifier("type"), types.stringLiteral(entry.type)),
                    ]),
                  ),
                ),
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
