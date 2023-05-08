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

const entryPoints = [];

for (const chunk in config.entry) {
	for (const entry of config.entry[chunk]) {
		const cacheKey = `${entry.replaceAll("/", "-").replaceAll("-", "_").replaceAll("@", "_")}`;
		nodeMapping[cacheKey] = {
			entry,
		}
		leafsMultiEntry[cacheKey] = [entry]
	}
}

const leafsConfig = Object.assign({}, dllConfig, { entry: leafsMultiEntry });

await command.handler({ development: process.env.NODE_ENV === 'development', config: leafsConfig }, []);

for (const leaf in nodeMapping) {
	nodeMapping[leaf].provides = Object.keys(JSON.parse(await fs.readFile(path.resolve(fileURLToPath(import.meta.url), "..", "..", 'dll', `${leaf}-dev-manifest.json`), { encoding: 'utf8' })).content);
};

const dependencyGraph = {};

let entries = Object.values(leafsMultiEntry).flat();

for (const leaf in nodeMapping) {
	for (const provision of nodeMapping[leaf].provides) {
		let packageName = provision.replaceAll("./node_modules/", '');
		let candidate = '';
		for (const entry of entries) {
			if (packageName.startsWith(`${entry}/`) && entry.length > candidate) {
				candidate = entry;
			}
		}
		if (candidate.length === 0) {
			candidate = packageName.split('/')[0]
		}
		packageName = candidate;
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

		let packageName = provision.replaceAll("./node_modules/", '');
		let candidate = '';
		for (const entry of entries) {
			if (packageName.startsWith(`${entry}/`) && entry.length > candidate) {
				candidate = entry;
			}
		}
		if (candidate.length === 0) {
			candidate = packageName.split('/')[0]
		}
		packageName = candidate;

		if (!provisionMap[packageName]) {
    	provisionMap[packageName] = [];
  	}
  	if (!provisionMap[packageName].includes(provision)) {
    	provisionMap[packageName].push(provision);
  	}
	}
}


console.log('package dependencies map', dependencyGraph)

console.log('package provisions map', provisionMap)

