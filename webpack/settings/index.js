const { randomUUID } = require("crypto");

const path = require("path");
const envConfig = require("dotenv").config({
  debug: process.env.DEBUG,
});

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

exports.SUPPORTED_LOCALES = (process.env.SUPPORTED_LOCALES || "en-US").split(",").map((locale) => locale.trim());

exports.WEBPACK_ROOT_PATH = path.resolve(__dirname, "..");

exports.PROJECT_NAME = process.env.PROJECT_NAME || path.resolve(process.env.INIT_CWD).split(path.sep).pop();

exports.DLL_BUILD_PATH = path.resolve(process.env.INIT_CWD, "dll");

exports.PROJECT_BUILD_PATH = path.resolve(process.env.INIT_CWD, "build");

exports.DEV_SERVER_PORT = Number(process.env.DEV_SERVER_PORT || 8888);

exports.PROGRESS = process.env.PROGRESS !== "false";

exports.BUILD_ID = randomUUID();
