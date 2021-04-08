const settings = require("../settings");

module.exports = {
	target: "web",
	mode: settings.DEVELOPMENT ? "development" : "production",
	resolve: {
		unsafeCache: false,
		modules: [settings.PROJECT_SRC_PATH, "node_modules"],
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		mainFields: ["browser", "main"],
		enforceExtension: false,
		symlinks: false,
		fallback: {
			process: false,
			path: require.resolve("path-browserify"),
		},
	},
	cache: settings.DEVELOPMENT,
};
