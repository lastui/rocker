import { injectMiddleware, ejectMiddleware } from "../middleware/dynamic";

function removeMiddleware(name) {
  ejectMiddleware(name);
}

async function addMiddleware(name, middleware) {
  ejectMiddleware(name);
  await injectMiddleware(name, middleware);
}

export { addMiddleware, removeMiddleware };
