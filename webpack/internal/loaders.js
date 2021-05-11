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
							presets: babel.presets,
							plugins: babel.plugins.map((plugin) => {
								if (typeof plugin === 'string') {
									return [plugin, {}, `babel-${plugin}`]
								} else {
									return [plugin[0], plugin[1], `babel-${plugin[2]}`]
								}
							}),
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
							classNameSlug: (hash, title) => `${settings.PROJECT_NAME}__${title}__${hash}`,
							babelOptions: {
								babelrc: false,
								presets: [],
								plugins: babel.plugins.map((plugin) => {
									if (typeof plugin === 'string') {
										return [plugin, {}, `linaria-${plugin}`]
									} else {
										return [plugin[0], plugin[1], `linaria-${plugin[2]}`]
									}
								}),
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
