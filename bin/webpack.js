#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

const binary = path.resolve(path.dirname(require.resolve('webpack-cli')), '../bin/cli.js');

const env = Object.create(process.env);
const args = process.argv.slice(2, process.argv.length);

spawn(binary, args, {
	stdio: 'inherit',
	cwd: process.cwd(),
	env
})
