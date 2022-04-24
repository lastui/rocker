exports.run = async function (options) {
	process.on("unhandledRejection", (reason) => {
		throw reason;
	});

	const eslint = require("eslint");
	const babelOptions = require("@lastui/babylon").env.production;

	const engine = new eslint.ESLint({
		allowInlineConfig: true,
		useEslintrc: false,
		fix: options.fix,
		baseConfig: {
	      "env": {
	        "es6": true
	      },
	      "parser": "@babel/eslint-parser",
	      parserOptions: {
		    sourceType: "module",
		    allowImportExportEverywhere: false,
		    ecmaFeatures: {
		      globalReturn: false,
		    },
		    requireConfigFile: false,
		    babelOptions,
		  },
	      "rules": {
	        "no-debugger": "error",
	        "eqeqeq": "error",
	      }
	    }
	});

	const files = 'src/**/*.{js,jsx,ts,tsx}';

	const results = await engine.lintFiles(files);

	if (options.fix) {
		await eslint.ESLint.outputFixes(results);
	}

	const formatter = await engine.loadFormatter('stylish');
    const output = await formatter.format(results);

    if (output) {
        console.log(output);
    }

    for (const result of results) {
        if (result.errorCount > 0) {
        	process.exitCode = 1;
      		return;
        }
    }
};