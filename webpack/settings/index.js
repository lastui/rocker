const { randomUUID } = require("crypto");
const envConfig = require("dotenv").config({ debug: process.env.DEBUG });
const path = require("path");

for (const k in envConfig) {
  if (k === "npm_config_argv") {
    continue;
  }
  process.env[k] = envConfig[k];
}

function namespace(value) {
  if (!value || value === "") {
    return "/";
  }
  const real = path.resolve("/" + value) + "/";
  if (real === "//") {
    return "/";
  }
  return real;
}

exports.LOG_LEVEL = process.env.DEBUG ? "verbose" : "info";

exports.DEVELOPMENT = process.env.NODE_ENV === "development";

exports.PROJECT_NAMESPACE = namespace(exports.DEVELOPMENT ? "" : process.env.PROJECT_NAMESPACE);

exports.DEV_SERVER_PORT = Number(process.env.DEV_SERVER_PORT ?? 0);

exports.PROGRESS = process.env.PROGRESS !== "false";

exports.BUILD_ID = randomUUID();

exports.GET_COUPLING_ID = (function () {
  const cache = {};
  return (name) => {
    if (!name) {
      return exports.BUILD_ID;
    }
    if (name in cache) {
      return exports.BUILD_ID + "-" + cache[name];
    }
    const value = randomUUID();
    cache[name] = value;
    return exports.BUILD_ID + "-" + value;
  };
})();

exports.SUPPORTED_LOCALES = (process.env.SUPPORTED_LOCALES || "en-US").split(",").map((locale) => locale.trim());
