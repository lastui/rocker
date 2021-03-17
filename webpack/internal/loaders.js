const babel = require("@lastui/babylon");

const settings = require("../settings");

module.exports = {
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.jsx?$/,
				enforce: "pre",
				include: [settings.PROJECT_SRC_PATH, /node_modules\/\@lastui*/],
				exclude: [/node_modules\/(?!(\@lastui*))/],
				use: {
					loader: "babel-loader",
					options: {
						babelrc: false,
						...babel,
						cacheDirectory: settings.DEVELOPMENT,
						cacheCompression: false,
						sourceMaps: settings.DEVELOPMENT,
					},
				},
			},
		],
	}
};
