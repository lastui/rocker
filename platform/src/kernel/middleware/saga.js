import { IO } from "@redux-saga/symbols";
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
                if (effect.payload.pattern === "*") {
                  return next(effect);
                }
                if (typeof effect.payload.pattern === "string") {
                  return next({
                    [IO]: true,
                    combinator: false,
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
                    pattern[i] = store.wrap(effect.payload.pattern[i]);
                  }
                  return next({
                    [IO]: true,
                    combinator: false,
                    payload: {
                      channel: effect.payload.channel,
                      pattern,
                    },
                    type: effect.type,
                  });
                }
                if (process.env.NODE_ENV === "development") {
                  warning("Saga TAKE pattern function is not supported");
                }
                return;
              }
              case "PUT": {
                return next({
                  [IO]: true,
                  combinator: false,
                  payload: {
                    channel: effect.payload.channel,
                    action: {
                      ...effect.payload.action,
                      type: store.wrap(effect.payload.action.type),
                    },
                  },
                  type: effect.type,
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
