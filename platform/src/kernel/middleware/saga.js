import { IO, SAGA_ACTION } from "@redux-saga/symbols";
import { runSaga as runSagaInternal, stdChannel } from "redux-saga";

import { warning } from "../../utils";
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
        effectMiddlewares: [
          (next) => (effect) => {
            switch (effect.type) {
              case "TAKE": {
                if (!effect.payload.pattern || effect.payload.pattern === "*") {
                  return next(effect);
                }
                if (typeof effect.payload.pattern === "string") {
                  return next({
                    [IO]: effect[IO],
                    [SAGA_ACTION]: effect[SAGA_ACTION],
                    combinator: effect.combinator,
                    payload: {
                      channel: effect.payload.channel,  // TODO this should be probably improved
                      pattern: store.wrap(effect.payload.pattern),
                    },
                    type: effect.type,
                  });
                }
                if (Array.isArray(effect.payload.pattern)) {
                  const pattern = new Array(effect.payload.pattern.length);
                  for (let i = 0; i < effect.payload.pattern.length; i++) {
                    pattern[i] = store.wrap(effect.payload.pattern[i]);
                  }
                  return next({
                    [IO]: effect[IO],
                    combinator: effect.combinator,
                    payload: {
                      channel: effect.payload.channel,  // TODO this should be probably improved
                      pattern,
                    },
                    type: effect.type,
                  });
                }
                /* istanbul ignore next */
                if (process.env.NODE_ENV === "development") {
                  warning("Saga TAKE pattern function is not supported", effect);
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
      channel.put(action);
      return result;
    },
    runSaga,
  };
};

export default createSagaMiddleware;
