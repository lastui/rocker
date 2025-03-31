import { IO, SAGA_ACTION } from "@redux-saga/symbols";
import { runSaga as runSagaInternal, stdChannel } from "redux-saga";

import { setSagaRunner } from "../registry/saga";

const createSagaMiddleware = (options = {}) => {
  const multicast = stdChannel();

  const context = options.context || undefined;

  const runSaga = (store, saga) =>
    runSagaInternal(
      {
        context,
        channel: {
          take(cb, matcher) {
            function unwrappingCallback(result) {
              if (typeof result.type !== "string") {
                cb(result);
                return;
              }
              cb({
                ...result,
                type: store.unwrap(result.type),
              });
            }
            cb.cancel = () => unwrappingCallback.cancel();
            return multicast.take(unwrappingCallback, matcher);
          },
        },
        dispatch: store.dispatch,
        getState: store.getState,
        effectMiddlewares: [
          (next) => (effect) => {
            switch (effect.type) {
              case "TAKE": {
                if (!effect.payload.pattern || effect.payload.pattern === "*" || typeof effect.payload.pattern === "symbol") {
                  return next(effect);
                }
                if (typeof effect.payload.pattern === "string") {
                  return next({
                    [IO]: effect[IO],
                    combinator: effect.combinator,
                    payload: {
                      channel: effect.payload.channel,
                      pattern: store.wrap(effect.payload.pattern),
                    },
                    type: effect.type,
                  });
                }
                if (Array.isArray(effect.payload.pattern)) {
                  const pattern = new Array(effect.payload.pattern.length);
                  for (let i = 0; i < effect.payload.pattern.length; i++) {
                    if (effect.payload.pattern[i] === "*" || typeof effect.payload.pattern[i] === "symbol") {
                      pattern[i] = effect.payload.pattern[i];
                    } else {
                      pattern[i] = store.wrap(effect.payload.pattern[i]);
                    }
                  }
                  return next({
                    [IO]: effect[IO],
                    combinator: effect.combinator,
                    payload: {
                      channel: effect.payload.channel,
                      pattern,
                    },
                    type: effect.type,
                  });
                }
                /* istanbul ignore next */
                if (process.env.NODE_ENV === "development") {
                  console.error("Saga TAKE pattern function is not supported", effect);
                }
                return;
              }
              case "PUT": {
                if (!effect.payload.action.type) {
                  return next(effect);
                }
                return next({
                  [IO]: effect[IO],
                  [SAGA_ACTION]: effect[SAGA_ACTION],
                  combinator: effect.combinator,
                  payload: {
                    action: {
                      ...effect.payload.action,
                      type: store.wrap(effect.payload.action.type),
                    },
                    channel: effect.payload.channel,
                  },
                  type: effect.type,
                  resolve: effect.resolve,
                });
              }
              default: {
                return next(effect);
              }
            }
          },
        ],
      },
      saga,
    );

  setSagaRunner(runSaga);

  return {
    sagaMiddleware: (_store) => (next) => (action) => {
      const result = next(action);
      multicast.put(action);
      return result;
    },
    runSaga,
  };
};

export default createSagaMiddleware;
