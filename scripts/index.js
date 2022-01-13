const fs = require("fs");
const path = require("path");

function flatten(ary) {
	return ary.reduce(
		(a, b) => (Array.isArray(b) ? a.concat(flatten(b)) : a.concat(b)),
		[]
	);
}

async function createSymlink(source, target) {
	return new Promise((resolve, reject) => {
		fs.lstat(source, function (err, stats) {
			if (err == null) {
				if (stats.isDirectory() && !stats.isSymbolicLink()) {
					fs.symlink(source, target, 'dir', function (err) {
						if (err) {
							return reject(err);
						}
						return resolve(target);
					});
				} else {
					fs.symlink(source, target, 'file', function (err) {
						if (err) {
							return reject(err);
						}
						return resolve(target);
					});
				}
			} else {
				return reject(err);
			}
		});
	});
}

async function ensureDirectory(nodePath) {
	return new Promise((resolve, reject) => {
		fs.stat(nodePath, function (err, stats) {
			if (err == null) {
				return resolve();
			} else if (err.code === "ENOENT") {
				fs.mkdir(nodePath, function (ok, error) {
					if (error) {
						return reject(error);
					} else {
						return resolve();
					}
				});
			} else {
				return reject(err);
			}
		});
	});
}

async function clearDirectory(nodePath) {
	const unlink = (item) =>
		new Promise((resolve, reject) => {
			fs[item.action](item.path, (err) =>
				err ? reject(err) : resolve()
			);
		});

	const nodes = await walkRecursive(nodePath);
	nodes.sort((a, b) => b.path.localeCompare(b.path));
	const work = nodes.map((item) => unlink(item));
	await Promise.allSettled(work);
}

async function walkRecursive(nodePath) {
	const work = await new Promise((resolve, reject) => {
		fs.lstat(nodePath, function (err, stats) {
			if (err == null) {
				if (stats.isDirectory() && !stats.isSymbolicLink()) {
					fs.readdir(nodePath, function (err, files) {
						if (err) {
							return reject(err);
						}
						let step = files.map((node) =>
							walkRecursive(path.join(nodePath, node))
						);
						step.push({
							path: nodePath,
							action: 'rmdir',
						});
						return resolve(Promise.all(step));
					});
				} else {
					return resolve([
						{
							path: nodePath,
							action: 'unlink',
						},
					]);
				}
			} else if (err.code === "ENOENT") {
				return resolve([]);
			} else {
				return reject(err);
			}
		});
	});
	const slice = await Promise.all(flatten(work));
	return slice;
}


module.exports = {
	createSymlink,
	ensureDirectory,
	clearDirectory,
};
