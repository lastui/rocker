const babel = require("@lastui/babylon");

const settings = require("../settings");

module.exports = {
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.[t|j]sx?$/,
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
							sourceType: 'module',
							highlightCode: true,
							shouldPrintComment: (val) => /license/.test(val),
      						compact: true,
      						inputSourceMap: false,
						},
					},
				],
			},
		    {
		       test: /\.(txt|json)$/,
		       type: 'asset/source',
		    },
		    {
		       test: /\.svg/,
		       type: 'asset/inline',
		    },
		],
	},
};
