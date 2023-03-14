const path = require("path");
const fs = require("fs");
const babelConfig = require("../babel").env.test;

process.env.TZ = "UTC";
process.env.NODE_ENV = "test";

const node_modules =
  path.dirname(process.env.INIT_CWD) === path.resolve(__dirname, "..")
    ? [
        "<rootDir>/../node_modules",
        "<rootDir>/../dependencies/node_modules",
        "<rootDir>/../platform/node_modules",
        "<rootDir>/../bootstrap/node_modules",
        "node_modules",
      ]
    : ["node_modules"];

module.exports = {
  rootDir: process.env.INIT_CWD,
  automock: false,
  verbose: true,
  collectCoverage: true,
  testEnvironment: "jsdom",
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "json", "lcov", "clover"],
  collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}"],
  moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
  transform: {
    "\\.[t|j]sx?$": [
      "babel-jest",
      {
        cwd: process.env.INIT_CWD,
        babelrc: false,
        sourceMaps: "inline",
        presets: babelConfig.presets,
        plugins: babelConfig.plugins,
      },
    ],
    "\\.css$": path.resolve(__dirname, "transform", "css.js"),
    "^(?!.*\\.(ts|js|jsx|tsx|css))": path.resolve(__dirname, "transform", "file.js"),
  },
  cacheDirectory: "<rootDir>/node_modules/@lastui/rocker/jest/.jest-cache",
  transformIgnorePatterns: [...node_modules, "<rootDir>/build/", "<rootDir>/static/"],
  testPathIgnorePatterns: [...node_modules, "<rootDir>/build/", "<rootDir>/static/"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    path.resolve(__dirname, "setupTests.js"),
    ...(fs.existsSync(path.resolve(process.env.INIT_CWD, "src", "setupTests.js"))
      ? ["<rootDir>/src/setupTests.js"]
      : []),
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
