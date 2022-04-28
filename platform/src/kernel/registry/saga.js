import { warning } from "../../utils";
import { cancel, spawn } from "redux-saga/effects";
import { getStore } from "./store";

const sagas = {};

let sagaRunner = () => {
  warning("Sagas runnner is not provided!");
};

function setSagaRunner(nextSagaRunner) {
  if (nextSagaRunner) {
    sagaRunner = nextSagaRunner;
  }
}

function removeSaga(id, preferentialStore) {
  const dangling = sagas[id];
  if (!dangling) {
    return;
  }
  console.debug(`module ${id} removing saga`);
  sagaRunner(preferentialStore, function* () {
    yield cancel(dangling);
  });
  delete sagas[id];
}

async function addSaga(id, preferentialStore, saga) {
  if (!sagas[id]) {
    delete sagas[id];
    console.debug(`module ${id} replacing saga`);
  } else {
    console.debug(`module ${id} introducing saga`);
  }
  sagaRunner(preferentialStore, function* () {
    try {
      sagas[id] = yield spawn(saga);
    } catch (error) {
      warning(`module ${id} saga crashed`, error);
    }
  });
}

export { addSaga, removeSaga, setSagaRunner };