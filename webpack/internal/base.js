const settings = require("../settings");

module.exports = {
	target: "web",
	mode: settings.DEVELOPMENT ? "development" : "production",
	resolve: {
		unsafeCache: false,
		modules: [settings.PROJECT_SRC_PATH, "node_modules"],
		extensions: [".js", ".jsx"],
		mainFields: ["browser", "main"],
		enforceExtension: false,
		fallback: {
			util: require.resolve("util/"),
			process: false,
			os: require.resolve("os-browserify"),
			stream: require.resolve("stream-browserify"),
			buffer: require.resolve("buffer/"),
			path: require.resolve("path-browserify"),
		},
	},
	cache: settings.DEVELOPMENT,
};
