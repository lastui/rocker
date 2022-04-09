const path = require("path");
const fs = require("fs");

process.env.TZ = "UTC";

const rootDir = process.cwd();

module.exports = {
	rootDir,
	automock: false,
	verbose: true,
	collectCoverage: true,
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
		"<rootDir>/node_modules/",
		"<rootDir>/build/",
		"<rootDir>/static/",
	],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/build/",
		"<rootDir>/static/",
	],
	setupFilesAfterEnv: [
		path.resolve(__dirname, "setupTests.js"),
		...(fs.existsSync(path.resolve(rootDir, "src/setupTests.js"))
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
};
