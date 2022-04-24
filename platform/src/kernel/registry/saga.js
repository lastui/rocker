import { warning } from "../../utils";
import { cancel, spawn } from "redux-saga/effects";

const sagas = {};

let sagaRunner = () => {
  warning("Sagas runnner is not provided!");
};

function setSagaRunner(nextSagaRunner) {
  if (nextSagaRunner) {
    sagaRunner = nextSagaRunner;
  }
}

function removeSaga(id) {
  const dangling = sagas[id];
  if (!dangling) {
    return;
  }
  console.debug(`module ${id} removing saga`);
  sagaRunner(function* () {
    yield cancel(dangling);
  });
  delete sagas[id];
}

async function addSaga(id, saga) {
  if (!sagas[id]) {
    delete sagas[id];
    console.debug(`module ${id} replacing saga`);
  } else {
    console.debug(`module ${id} introducing saga`);
  }
  sagaRunner(function* () {
    try {
      sagas[id] = yield spawn(saga);
    } catch (error) {
      warning(`module ${id} saga crashed`, error);
    }
  });
}

export { addSaga, removeSaga, setSagaRunner };
