const path = require("path");
const fs = require("fs");

process.env.TZ = "UTC";

const node_modules =
	path.dirname(process.env.INIT_CWD) === path.resolve(__dirname, "..")
		? [
				"<rootDir>/../node_modules",
				"<rootDir>/../dependencies/node_modules",
				"<rootDir>/../platform/node_modules",
				"<rootDir>/../bootstrap/node_modules",
		  ]
		: ["<rootDir>/node_modules"];

module.exports = {
	rootDir: process.env.INIT_CWD,
	automock: false,
	verbose: true,
	collectCoverage: true,
	testEnvironment: 'jsdom',
	coverageDirectory: "<rootDir>/coverage",
	coverageReporters: ["text", "lcov", "clover"],
	collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}"],
	moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
	transform: {
		"\\.[t|j]sx?$": path.resolve(__dirname, "transform/index.js"),
		"\\.css$": path.resolve(__dirname, "transform/css.js"),
		"^(?!.*\\.(ts|js|jsx|tsx|css))": path.resolve(
			__dirname,
			"transform/file.js"
		),
	},
	cacheDirectory: "<rootDir>/node_modules/@lastui/rocker/jest/.jest-cache",
	transformIgnorePatterns: [
		...node_modules,
		"<rootDir>/build/",
		"<rootDir>/static/",
	],
	testPathIgnorePatterns: [
		...node_modules,
		"<rootDir>/build/",
		"<rootDir>/static/",
	],
	setupFilesAfterEnv: [
		path.resolve(__dirname, "setupTests.js"),
		...(fs.existsSync(
			path.resolve(process.env.INIT_CWD, "src/setupTests.js")
		)
			? ["<rootDir>/src/setupTests.js"]
			: []),
	],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	moduleDirectories: [...node_modules, "<rootDir>/src"],
	moduleNameMapper: {
		"@lastui/rocker/platform": path.resolve(
			__dirname,
			"__mocks__/platform.js"
		),
	},
};
