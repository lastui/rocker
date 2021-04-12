const settings = require("../settings");

module.exports = settings.DEVELOPMENT
	? require("./module.development.js")
	: require("./module.production.js");