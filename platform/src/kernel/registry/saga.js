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

function removeSaga(name, preferentialStore) {
  const dangling = sagas[name];
  if (!dangling) {
    return;
  }
  console.debug(`module ${name} removing saga`);
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
    console.debug(`module ${name} replacing saga`);
  } else {
    console.debug(`module ${name} introducing saga`);
  }
  sagaRunner(preferentialStore, function* () {
    sagas[name] = yield spawn(function* () {
      while (true) {
        const isReady = yield select((state) => state.env.readyModules[name]);
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
        warning(`module ${name} saga crashed`, error);
      }
    });
  });
}

export { addSaga, removeSaga, setSagaRunner };
