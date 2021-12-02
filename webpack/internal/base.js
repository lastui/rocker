const settings = require("../settings");

module.exports = {
	target: "web",
	mode: settings.DEVELOPMENT ? "development" : "production",
	resolve: {
		unsafeCache: false,
		modules: [settings.PROJECT_SRC_PATH, "node_modules"],
		extensions: [".js", ".jsx", ".scss", ".css", ".json", ".txt"],
		mainFields: ["browser", "main"],
		enforceExtension: false,
		symlinks: false,
		fallback: {
			process: false,
			path: require.resolve("path-browserify"),
			util: require.resolve("util/"),
		},
		alias: {},
	},
	cache: settings.DEVELOPMENT,
	module: {
		strictExportPresence: true,
		rules: [{ parser: { requireEnsure: false } }],
	},
};