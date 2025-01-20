import process from "node:process";

import globals from "globals";

import eslint from "eslint";

import babelConfig from "../../babel/index.js";
import babelParser from "@babel/eslint-parser";

import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";

import { config as prettierConfig } from "./prettier.mjs";

export const config = [
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        BUILD_ID: true,
      },
    },
    plugins: {
      import: pluginImport,
      react: pluginReact,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          globalReturn: false,
        },
        requireConfigFile: false,
        babelOptions: babelConfig.env.development,
      },
    },
    rules: {
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
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        pragma: "React",
        version: "18.3.1",
      },
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
  {
    files: ["**/*.test.*", "**/__tests__/*"],
    settings: {
      jest: {
        version: "29.7.0",
      },
    },
  },
];

function serializeConfig(data) {
  const result = [];
  for (const section of data) {
    const { languageOptions, ...rest } = section;
    if ("plugins" in rest) {
      rest.plugins = Object.keys(rest.plugins);
    }
    result.push(rest);
  }
  return result;
}

export async function createEngine(options) {
  const engine = new eslint.ESLint({
    cwd: process.env.INIT_CWD,
    overrideConfigFile: true,
    allowInlineConfig: true,
    warnIgnored: true,
    fix: options.fix,
    baseConfig: config,
  });

  if (options.debug) {
    const colors = (await import("ansi-colors")).default;
    console.log(colors.dim("Eslint Configuration"));
    console.log(JSON.stringify(serializeConfig(config), null, prettierConfig.tabWidth));
    console.log();
  }

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
      for (const item of results[0].messages) {
        const chunk = Object.assign(
          {
            engineId: "eslint",
          },
          item,
        );
        info.issues.push(chunk);
      }
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
