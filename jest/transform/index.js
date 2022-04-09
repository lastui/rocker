const babelConfig = require("@lastui/babylon").env.test;
const babelJest = require("babel-jest");

module.exports = babelJest.default.createTransformer({
	babelrc: false,
	presets: babelConfig.presets,
	plugins: babelConfig.plugins,
});
