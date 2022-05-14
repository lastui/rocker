import { cancel, spawn, select, take } from "redux-saga/effects";

import * as constants from "../../constants";
import { warning } from "../../utils";

const sagas = {};

const defaultSagaRunner = () => {
  warning("Sagas runnner is not provided!");
};

let sagaRunner = defaultSagaRunner;

function setSagaRunner(nextSagaRunner) {
  if (nextSagaRunner) {
    sagaRunner = nextSagaRunner;
  } else {
    sagaRunner = defaultSagaRunner;
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
  if (sagas[id]) {
    delete sagas[id];
    console.debug(`module ${id} replacing saga`);
  } else {
    console.debug(`module ${id} introducing saga`);
  }
  sagaRunner(preferentialStore, function* () {
    sagas[id] = yield spawn(function* () {
      while (true) {
        const isReady = yield select((state) => state.shared.readyModules[id]);
        if (isReady) {
          break;
        }
        const init = yield take(constants.MODULE_INIT);
        if (init.payload.module === id) {
          break;
        }
      }
      try {
        yield saga();
      } catch (error) {
        warning(`module ${id} saga crashed`, error);
      }
    });
  });
}

export { addSaga, removeSaga, setSagaRunner };