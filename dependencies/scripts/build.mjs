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

const provisionGraph = {};

for (const leaf in nodeMapping) {
	for (const provision of nodeMapping[leaf].provides) {
		if (!provisionGraph[provision]) {
        	provisionGraph[provision] = [];
      	}
      	if (!provisionGraph[provision].includes(nodeMapping[leaf].entry)) {
        	provisionGraph[provision].push(nodeMapping[leaf].entry);
      	}
	}
}

console.log('provisionGraph', provisionGraph)

//const dependencyGraph = {};
//
//for (const leaf in nodeMapping) {
//
//	for (const provision of nodeMapping[leaf].provides) {
//		const requirements = provisionGraph[provision];
//
//		for (const requirement of requirements) {
//			if (!dependencyGraph[requirement]) {
//				dependencyGraph[requirement] = []
//			}
//			if (requirement === nodeMapping[leaf].entry) {
//				continue
//			}
//			if (!dependencyGraph[requirement].includes(nodeMapping[leaf].entry)) {
//        		dependencyGraph[requirement].push(nodeMapping[leaf].entry);
//      		}
//		}
//	}
//
//}


