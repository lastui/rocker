const settings = require("../../settings");

module.exports = settings.DEVELOPMENT ? require("./development.js") : require("./production.js");