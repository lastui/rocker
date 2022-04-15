import { injectMiddleware, ejectMiddleware } from "../middleware/dynamic";

function removeMiddleware(id) {
	if (!ejectMiddleware(id)) {
		return;
	}
	console.debug(`module ${id} removing middleware`);
}

async function addMiddleware(id, middleware) {
	if (ejectMiddleware(id)) {
		console.debug(`module ${id} replacing middleware`);
	} else {
		console.debug(`module ${id} introducing middleware`);
	}
	const ok = await injectMiddleware(id, middleware);
	if (!ok) {
		return;
	}
}

export { addMiddleware, removeMiddleware };
