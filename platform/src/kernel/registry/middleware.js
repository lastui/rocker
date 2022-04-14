import { injectMiddleware, ejectMiddleware } from "../middleware/dynamic";

function removeMiddleware(id) {
	if (!ejectMiddleware(id)) {
		return;
	}
	console.debug(`module ${id} removing middleware`);
}

async function addMiddleware(id, middleware) {
	const ok = await injectMiddleware(id, middleware);
	if (!ok) {
		return;
	}
	console.debug(`module ${id} introducing middleware`);
}

export { addMiddleware, removeMiddleware };
