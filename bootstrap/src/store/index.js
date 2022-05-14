import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import {
  setStore,
  sharedReducer,
  modulesReducer,
  createLoaderMiddleware,
  dynamicMiddleware,
  createSagaMiddleware,
} from "@lastui/rocker/platform";

import { runtimeReducer } from "../reducer";
import { watchRefresh, watchFetchContext, watchBootstrap } from "../saga";

export default (fetchContext, bootstrapMiddlewares) => {
  const loaderMiddleware = createLoaderMiddleware();
  const { sagaMiddleware, runSaga } = createSagaMiddleware({
    context: {
      fetchContext: async () => {
        const ctx = await fetchContext();
        return {
          entrypoint: ctx?.entrypoint || null,
          available: ctx?.available || [],
          environment: ctx?.environment || {},
        };
      },
    },
  });

  const enhancers = [loaderMiddleware, sagaMiddleware, ...(bootstrapMiddlewares || []), dynamicMiddleware];

  const composer =
    process.env.NODE_ENV === "development" ? require("@redux-devtools/extension").composeWithDevTools : compose;

  const reducer = combineReducers({
    runtime: runtimeReducer,
    shared: sharedReducer,
    modules: modulesReducer,
  });

  const store = createStore(reducer, {}, composer(...[applyMiddleware(...enhancers)]));
  setStore(store);

  const sagas = [watchBootstrap, watchFetchContext, watchRefresh];
  runSaga(store, function* rooSaga() {
    yield all(sagas.map(fork));
  });

  return store;
};