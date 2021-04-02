const settings = require("../settings");

module.exports = settings.DEVELOPMENT
	? require("./spa.development.js")
	: require("./spa.production.js")
