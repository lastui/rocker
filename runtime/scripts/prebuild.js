const { execSync } = require("child_process");
const path = require("path");
const cwd = path.resolve(__dirname, '..');
const platform = path.resolve(__dirname, '../../platform');

execSync(`rm -rf ./node_modules`);
execSync(`ln -s ../dependencies/node_modules ./node_modules`);

execSync(`rm -rf ./node_modules/@lastui/rocker || :`);
execSync(`mkdir -p ./node_modules/@lastui/rocker`);
execSync(`ln -s ${platform}/src ./node_modules/@lastui/rocker/platform`);
execSync(`ln -s ${cwd}/src ./node_modules/@lastui/rocker/runtime`);