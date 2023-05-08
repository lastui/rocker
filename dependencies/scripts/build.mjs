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
        sourceType: "umd",
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

  const allProvisions = [];

  const leafsMultiEntry = {};

  const entryPoints = [];

  for (const entry of config.entry[chunk]) {
    const cacheKey = toCacheKey(chunk, entry);
    nodeMapping[cacheKey] = {
      entry,
      chunk,
    };
    leafsMultiEntry[cacheKey] = [entry];
  }

  const leafsConfig = Object.assign({}, dllConfig, { entry: leafsMultiEntry });

  await command.handler({ development, config: leafsConfig }, []);

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

    for (const provision of nodeMapping[leaf].provides) {
      if (!allProvisions.includes(provision)) {
        allProvisions.push(provision);
      }
    }

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

  const dependencyGraph = {};

  let entries = Object.values(leafsMultiEntry).flat();

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

  const provisionMap = {};

  entries = Object.keys(dependencyGraph);

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
        "umd",
      ),
    ),
    generateDllConfig(
      chunk,
      allProvisions,
      compilationOrder.map((item) => toCacheKey(chunk, item)),
      "umd",
    ),
  ];

  await command.handler({ development, config: strategy }, []);

  for (const entry of compilationOrder) {
    const item = {
      name: toCacheKey(chunk, entry),
      type: "umd",
    };
    if (!allDlls.includes(item)) {
      allDlls.push(item);
    }
  }

  allDlls.push({
    name: chunk,
    type: "umd",
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
