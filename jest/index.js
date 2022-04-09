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
		"^.+\\.jsx?$": path.resolve(__dirname, "transform/index.js"),
		"^.+\\.tsx?$": path.resolve(__dirname, "transform/index.js"),
		"^.+\\.css$": path.resolve(__dirname, "transform/css.js"),
		"^(?!.*\\.(ts|js|jsx|tsx|css))": path.resolve(
			__dirname,
			"transform/file.js"
		),
	},
	cacheDirectory: "<rootDir>/node_modules/@lastui/jest/.jest-cache",
	transformIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/build/",
		"<rootDir>/static/",
	],
	transformIgnorePatterns: [
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
			branches: 20,
			functions: 20,
			lines: 20,
			statements: 20,
		},
	},
};
