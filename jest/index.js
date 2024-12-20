const fs = require("fs");
const path = require("path");

process.env.TZ = "UTC";
process.env.NODE_ENV = "test";
process.env.BABEL_ENV = "test";

const cacheDirectory = path.resolve(
  require.resolve("jest").split(path.join(path.sep, "node_modules", path.sep))[0],
  "node_modules",
  ".cache",
  "jest-runner",
);

const node_modules =
  path.dirname(process.env.INIT_CWD) === path.dirname(__dirname)
    ? ["../dependencies/node_modules", "../node_modules", "node_modules"]
    : ["node_modules"];

module.exports = {
  rootDir: process.env.INIT_CWD,
  automock: false,
  verbose: true,
  collectCoverage: true,
  testEnvironment: "jsdom",
  coverageDirectory: "<rootDir>/reports",
  coverageReporters: ["text", "json", "lcov", "clover"],
  collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}"],
  moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
  transform: {
    "\\.[t|j]sx?$": [
      "babel-jest",
      {
        ...require("../babel").env.test,
        cwd: process.env.INIT_CWD,
        babelrc: false,
        sourceMaps: "inline",
      },
    ],
    "\\.css$": path.resolve(__dirname, "transform", "css.js"),
    "^(?!.*\\.(ts|js|jsx|tsx))": path.resolve(__dirname, "transform", "file.js"),
  },
  cacheDirectory,
  transformIgnorePatterns: [...node_modules, "<rootDir>/build/", "<rootDir>/static/"],
  testPathIgnorePatterns: [...node_modules, "<rootDir>/build/", "<rootDir>/static/"],
  setupFilesAfterEnv: [
    ...(fs.existsSync(path.resolve(process.env.INIT_CWD, "src", "setupTests.js")) ? ["<rootDir>/src/setupTests.js"] : []),
    path.resolve(__dirname, "setupTests.js"),
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: [...node_modules, "<rootDir>/src"],
  moduleNameMapper: {
    "@lastui/rocker/platform": path.resolve(__dirname, "__mocks__", "platform.js"),
    "@lastui/rocker/test": path.resolve(__dirname, "helpers", "platform.js"),
  },
};
