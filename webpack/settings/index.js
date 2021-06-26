const path = require("path");
const envConfig = require("dotenv").config({ debug: process.env.DEBUG });

for (const k in envConfig) {
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

exports.LOG_LEVEL = process.env.DEBUG ? "debug" : "info";

exports.DEVELOPMENT = process.env.NODE_ENV === "development";

exports.PROJECT_NAMESPACE = namespace(
	exports.DEVELOPMENT ? "" : process.env.PROJECT_NAMESPACE
);

exports.SUPPORTED_LOCALES = (process.env.SUPPORTED_LOCALES || "en-US")
	.split(",")
	.map((locale) => locale.trim());

exports.PROJECT_ROOT_PATH = path.resolve("./");

exports.PROJECT_NAME = path.resolve(process.cwd()).split(path.sep).pop();

exports.WEBPACK_ROOT_PATH = path.resolve(__dirname, "..");

exports.DLL_BUILD_PATH = path.join(exports.PROJECT_ROOT_PATH, "dll");
exports.PROJECT_BUILD_PATH = path.join(exports.PROJECT_ROOT_PATH, "build");
exports.PROJECT_DEV_PATH = path.join(exports.PROJECT_ROOT_PATH, "dev");
exports.PROJECT_SRC_PATH = path.join(exports.PROJECT_ROOT_PATH, "src");

exports.DEV_SERVER_PORT = Number(process.env.DEV_SERVER_PORT || 5000);
