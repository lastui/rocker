import process from 'node:process';
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
  rules: {
    "no-debugger": "error",
    eqeqeq: ["error", "always"],
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
      if (!info.changed) {
        info.changed = results[0].messages.length !== 0 || Boolean(results[0].output);
      }
    } catch (error) {
      info.errors.push({
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
};
