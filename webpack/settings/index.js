const path = require("path");

exports.LOG_LEVEL = "debug";

exports.DEVELOPMENT = process.env.NODE_ENV === "development";

exports.PROJECT_ROOT_PATH = path.resolve("./");
exports.WEBPACK_ROOT_PATH = path.resolve(__dirname, "..");

exports.DLL_BUILD_PATH = path.resolve(exports.PROJECT_ROOT_PATH, "dll");
exports.PROJECT_BUILD_PATH = path.resolve(exports.PROJECT_ROOT_PATH, "build");
exports.PROJECT_SRC_PATH = path.resolve(exports.PROJECT_ROOT_PATH, "src");