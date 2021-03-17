const settings = require("../settings");

module.exports = settings.DEVELOPMENT
	? require("./runtime.development.js")
	: require("./runtime.production.js")
