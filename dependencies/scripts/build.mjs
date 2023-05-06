import { fileURLToPath } from 'node:url';
import path from "node:path";
import fs from 'node:fs/promises';

process.env.INIT_CWD = path.resolve(fileURLToPath(import.meta.url), "..", "..");
process.env.NODE_ENV = 'development';

const dllConfig = (await import("../../webpack/config/dll/index.js")).default;

const config = (await import("../webpack.config.js")).default;

const command = await import("../../cli/commands/build.js");

const nodeMapping = {};

const leafsMultiEntry = {}

for (const chunk in config.entry) {
	for (const entry of config.entry[chunk]) {
		const cacheKey = `${chunk}_${entry.replaceAll("/", "-").replaceAll("-", "_").replaceAll("@", "")}`;

		nodeMapping[cacheKey] = {
			chunk,
			entry,
		}
		leafsMultiEntry[cacheKey] = [entry]
	}
}

const leafsConfig = Object.assign({}, dllConfig, { entry: leafsMultiEntry });

await command.handler({ development: process.env.NODE_ENV === 'development', config: leafsConfig }, []);

for (const leaf in nodeMapping) {
	nodeMapping[leaf].provides = Object.keys((await import(`../dll/${leaf}-dev-manifest.json`, { assert: { type: 'json' } })).default.content);
};

const dependencyGraph = {};

for (const leaf in nodeMapping) {
	for (const provision of nodeMapping[leaf].provides) {
		if (!dependencyGraph[provision]) {
        	dependencyGraph[provision] = [];
      	}
      	if (!dependencyGraph[provision].includes(nodeMapping[leaf].entry)) {
        	dependencyGraph[provision].push(nodeMapping[leaf].entry);
      	}
	}
}

console.log('dependencyGraph', dependencyGraph);
