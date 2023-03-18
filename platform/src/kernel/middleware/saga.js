import { runSaga as runSagaInternal, stdChannel } from "redux-saga";
import { setSagaRunner } from "../registry/saga";

const createSagaMiddleware = (options = {}) => {
  const channel = stdChannel();
  const context = options.context || undefined;
  const runSaga = (store, saga) =>
    runSagaInternal(
      {
        context,
        channel,
        dispatch: store.dispatch,
        getState: store.getState,
      },
      saga,
    );
  setSagaRunner(runSaga);
  return {
    sagaMiddleware: _store => next => action => {
      const result = next(action);
      channel.put(action);
      return result;
    },
    runSaga,
  };
};

export default createSagaMiddleware;
