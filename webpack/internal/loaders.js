const path = require("path");
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
				use: [
					{
						loader: "babel-loader",
						options: {
							babelrc: false,
							...babel,
							sourceMaps: false,
							sourceType: "module",
							highlightCode: true,
							shouldPrintComment: (val) => /license/.test(val),
							compact: true,
							inputSourceMap: false,
						},
					},
					{
						loader: "@linaria/webpack-loader",
						options: {
							sourceMap: false,
							preprocessor: "stylis",
							cacheDirectory: path.join(
								settings.WEBPACK_ROOT_PATH,
								".linaria-cache"
							),
							babelOptions: {
								babelrc: false,
								...babel,
								sourceMaps: false,
								sourceType: "module",
								inputSourceMap: false,
							},
						},
					},
				],
			},
			{
				test: /\.txt$/,
				type: "asset/source",
			},
			{
				test: /\.json$/,
				type: "json",
			},
		],
	},
};
