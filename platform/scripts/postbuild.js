const { execSync } = require("child_process");

execSync(`rm -rf ./node_modules/rocker`);
execSync(`rm -rf ./node_modules`);
