import { warning } from "../../utils";
import { cancel, spawn, select, take } from "redux-saga/effects";

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
  if (sagas[id]) {
    delete sagas[id];
    console.debug(`module ${id} replacing saga`);
  } else {
    console.debug(`module ${id} introducing saga`);
  }
  sagaRunner(preferentialStore, function* () {
    try {
      sagas[id] = yield spawn(function* () {
        while (true) {
          const isReady = yield select((state) => state.shared.readyModules[id]);
          if (isReady) {
            break
          }
          yield take();
        };
        yield saga();
      });
    } catch (error) {
      warning(`module ${id} saga crashed`, error);
    }
  });
}

export { addSaga, removeSaga, setSagaRunner };