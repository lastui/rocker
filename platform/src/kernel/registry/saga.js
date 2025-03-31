import { cancel, spawn, select, take } from "redux-saga/effects";

import * as constants from "../../constants";

const sagas = {};

const defaultSagaRunner = () => {
  console.error("Sagas runnner is not provided!");
};

let sagaRunner = defaultSagaRunner;

function setSagaRunner(nextSagaRunner) {
  if (nextSagaRunner) {
    sagaRunner = nextSagaRunner;
  } else {
    sagaRunner = defaultSagaRunner;
  }
}

function removeSaga(name, preferentialStore) {
  const dangling = sagas[name];
  if (!dangling) {
    return;
  }
  sagaRunner(preferentialStore, function* () {
    yield cancel(dangling);
  });
  delete sagas[name];
}

async function addSaga(name, preferentialStore, saga) {
  const dangling = sagas[name];
  if (dangling) {
    sagaRunner(preferentialStore, function* () {
      yield cancel(dangling);
    });
    delete sagas[name];
  }
  sagaRunner(preferentialStore, function* () {
    sagas[name] = yield spawn(function* () {
      while (true) {
        const isReady = yield select((state) => name in state.env.readyModules);
        if (isReady) {
          break;
        }
        const init = yield take(constants.MODULE_INIT);
        if (init.payload.module === name) {
          break;
        }
      }
      try {
        yield saga();
      } catch (error) {
        console.error(`module ${name} saga crashed`, error);
      }
    });
  });
}

export { addSaga, removeSaga, setSagaRunner };
