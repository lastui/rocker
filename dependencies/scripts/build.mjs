import { fileURLToPath } from 'node:url';
import path from "node:path";
import fs from 'node:fs/promises';
import webpack from 'webpack';

process.env.INIT_CWD = path.resolve(fileURLToPath(import.meta.url), "..", "..");
//process.env.NODE_ENV = 'development';

const dllConfig = (await import("../../webpack/config/dll/index.js")).default;

const config = (await import("../webpack.config.js")).default;

const command = await import("../../cli/commands/build.js");


function toCacheKey(chunk, item) {
	return `${chunk}_${item.replaceAll("/", "-").replaceAll("@", "-").replaceAll("-", "_")}`;
}

function generateDllConfig(name, provides, references) {
	const plugins = references.map((reference) => new webpack.DllReferencePlugin({
    	manifest: path.resolve(fileURLToPath(import.meta.url), "..", "..", 'dll', `${reference}-${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-manifest.json`),
    	sourceType: "var",
    	context: process.env.INIT_CWD,
 	}));

	return Object.assign(
		{},
		dllConfig,
		{
			entry: { [name]: provides },
			plugins: [
				...dllConfig.plugins,
				...plugins,
			],
		}
	);
}

for (const chunk in config.entry) {

	const nodeMapping = {};

	const allProvisions = [];

	const leafsMultiEntry = {}

	const entryPoints = [];

	for (const entry of config.entry[chunk]) {
		const cacheKey = toCacheKey(chunk, entry);
		nodeMapping[cacheKey] = {
			entry,
			chunk,
		}
		leafsMultiEntry[cacheKey] = [entry]
	}

	const leafsConfig = Object.assign({}, dllConfig, { entry: leafsMultiEntry });

	await command.handler({ development: process.env.NODE_ENV === 'development', config: leafsConfig }, []);

	for (const leaf in nodeMapping) {
		nodeMapping[leaf].provides = Object.keys(JSON.parse(await fs.readFile(path.resolve(fileURLToPath(import.meta.url), "..", "..", 'dll', `${leaf}-${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-manifest.json`), { encoding: 'utf8' })).content);
		
		for (const provision of nodeMapping[leaf].provides) {
			if (!allProvisions.includes(provision)) {
		    	allProvisions.push(provision);
		  	}
		}

		await fs.rm(path.resolve(fileURLToPath(import.meta.url), "..", "..", 'dll', `${leaf}-${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-manifest.json`), { recursive: false, force: true })
		await fs.rm(path.resolve(fileURLToPath(import.meta.url), "..", "..", 'dll', `${leaf}.dll${process.env.NODE_ENV === 'development' ? '' : '.min'}.js`), { recursive: false, force: true })
	};

	const dependencyGraph = {};

	let entries = Object.values(leafsMultiEntry).flat();

	for (const leaf in nodeMapping) {
		for (const provision of nodeMapping[leaf].provides) {
			let candidate = '';
			for (const entry of entries) {
				if (provision.startsWith(`./node_modules/${entry}/`) && entry.length > candidate) {
					candidate = entry;
				}
			}
			if (candidate.length === 0) {
				candidate = provision.split('/')[2]
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
			let candidate = '';
			for (const entry of entries) {
				if (provision.startsWith(`./node_modules/${entry}/`) && entry.length > candidate) {
					candidate = entry;
				}
			}
			if (candidate.length === 0) {
				candidate = provision.split('/')[2]
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

	const compilationOrder = (function() {
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
		  };
		  result.push(packageName);
		}
		return result.filter((item) => Boolean(provisionMap[item]))
	}())


	for (const entry of compilationOrder) {
		const chunkDLLConfig = generateDllConfig(toCacheKey(chunk, entry), provisionMap[entry], dependencyGraph[entry].map((item) => toCacheKey(chunk, item)));
		await command.handler({ development: process.env.NODE_ENV === 'development', config: chunkDLLConfig }, []);
	}

	const finalDllConfig = generateDllConfig(chunk, allProvisions, compilationOrder.map((item) => toCacheKey(chunk, item)));

	await command.handler({ development: process.env.NODE_ENV === 'development', config: finalDllConfig }, []);

}
