const { execSync } = require("child_process");
const path = require("path");
const runtime = path.resolve(__dirname, '..');
const platform = path.resolve(__dirname, '../../platform');
const reduxDevtoolsExtension = path.resolve(__dirname, '../../node_modules/redux-devtools-extension');

execSync(`rm -rf ./node_modules`);
execSync(`ln -s ../dependencies/node_modules ./node_modules`);

execSync(`rm -rf ./node_modules/@lastui/rocker || :`);
execSync(`rm -rf ./node_modules/@lastui/redux-devtools-extension || :`);
execSync(`mkdir -p ./node_modules/@lastui/rocker`);
execSync(`mkdir -p ./node_modules/@lastui/redux`);
execSync(`ln -s ${platform}/src ./node_modules/@lastui/rocker/platform`);
execSync(`ln -s ${runtime}/src ./node_modules/@lastui/rocker/runtime`);
execSync(`ln -s ${reduxDevtoolsExtension} ./node_modules/redux-devtools-extension`);
