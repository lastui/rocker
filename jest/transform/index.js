const babelConfig = require("@lastui/babylon").env.test;
const babelJest = require("babel-jest");

const options = {
	babelrc: false,
	presets: babelConfig.presets,
	plugins: babelConfig.plugins,
};

module.exports = babelJest.default.createTransformer(options);
