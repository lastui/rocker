import process from "node:process";

import globals from "globals";

import eslint from "eslint";

import babelConfig from "../../babel/index.js";
import babelParser from "@babel/eslint-parser";

import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";

export const config = [
  {
    languageOptions: {
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          globalReturn: false,
        },
        requireConfigFile: false,
        babelOptions: babelConfig.env.development,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    linterOptions: {},
    plugins: {
      react: pluginReact,
      import: pluginImport,
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-debugger": "error",
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-unused-expressions": "error",
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
  },
  {
    files: ["**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];

export async function createEngine(options) {
  const engine = new eslint.ESLint({
    cwd: process.env.INIT_CWD,
    overrideConfigFile: true,
    allowInlineConfig: true,
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
      const results = await engine.lintText(info.data, { filePath: info.filePath, warnIgnored: true });
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
