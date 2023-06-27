import process from "node:process";
import eslint from "eslint";

import babelConfig from "../../babel/index.js";

export const config = {
  env: {
    es6: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    requireConfigFile: false,
    babelOptions: babelConfig.env.development,
  },
  plugins: ["import"],
  rules: {
    "no-debugger": "error",
    eqeqeq: ["error", "always"],
    "import/first": "error",
    "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
    "import/default": "warn",
    "import/named": "warn",
    "import/namespace": "warn",
    "import/no-cycle": "error",
    "import/no-duplicates": "error",
    "import/no-amd": "error",
    "import/no-mutable-exports": "error",
    "import/no-named-as-default-member": "warn",
    "import/no-useless-path-segments": "warn",
    "import/no-self-import": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "@lastui/**",
            group: "internal",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["@lastui/**"],
        groups: [["builtin", "external"], "internal", "parent", ["sibling", "index"], ["object", "type"]],
        distinctGroup: false,
      },
    ],
  },
};

export async function createEngine(options) {
  const engine = new eslint.ESLint({
    cwd: process.env.INIT_CWD,
    allowInlineConfig: true,
    useEslintrc: false,
    fix: options.fix,
    baseConfig: config,
  });

  async function processFile(info) {
    if (!/\.[t|j]sx?$/.test(info.filePath)) {
      return;
    }

    let start = null;
    let end = null;

    try {
      start = process.hrtime();
      const results = await engine.lintText(info.data, { filePath: info.filePath });
      end = process.hrtime(start);
      if (options.fix && results[0].output) {
        info.changed = true;
        info.data = results[0].output;
      }
      info.issues.push(...results[0].messages.map((item) => ({ engineId: "eslint", ...item })));
    } catch (error) {
      info.issues.push({
        engineId: "eslint",
        message: error,
        severity: 3,
      });
    }

    if (end) {
      info.timing.push({
        engineId: "eslint",
        duration: end[0] * 1_000 + end[1] / 1_000_000,
      });
    } else {
      info.timing.push({
        engineId: "eslint",
        duration: 0,
      });
    }
  }

  return processFile;
}
