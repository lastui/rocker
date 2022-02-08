const settings = require("../settings");

module.exports = {
	target: "web",
	mode: settings.DEVELOPMENT ? "development" : "production",
	resolve: {
		unsafeCache: false,
		modules: [settings.PROJECT_SRC_PATH, settings.NODE_MODULES_PATH],
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
	module: {
		strictExportPresence: true,
		rules: [{ parser: { requireEnsure: false } }],
	},
	cache: {
		type: "memory",
	},
	snapshot: {
		managedPaths: [settings.NODE_MODULES_PATH],
	},
};
