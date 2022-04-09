const path = require("path");

module.exports = {
	process(src, filename) {
		return filename !== undefined
			? `module.exports = "path.basename(filename)";`
			: "module.exports = undefined;";
	},
};
