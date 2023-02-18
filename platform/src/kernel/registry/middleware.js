import { injectMiddleware, ejectMiddleware } from "../middleware/dynamic";

function removeMiddleware(name) {
  if (!ejectMiddleware(name)) {
    return;
  }
  console.debug(`module ${name} removing middleware`);
}

async function addMiddleware(name, middleware) {
  if (ejectMiddleware(name)) {
    console.debug(`module ${name} replacing middleware`);
  } else {
    console.debug(`module ${name} introducing middleware`);
  }
  await injectMiddleware(name, middleware);
}

export { addMiddleware, removeMiddleware };