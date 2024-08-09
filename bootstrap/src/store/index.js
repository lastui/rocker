/* global BUILD_ID */

import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import { all } from "redux-saga/effects";

import {
  setStore,
  getStore,
  sharedReducer,
  envReducer,
  modulesReducer,
  createLoaderMiddleware,
  createDynamicMiddleware,
  createSagaMiddleware,
} from "@lastui/rocker/platform";

import { runtimeReducer, localisationReducer } from "../reducer";
import { watchRefresh, watchFetchContext, watchBootstrap, watchModules, watchChangeLanguage } from "../saga";

export default (router, fetchContext, bootstrapMiddlewares) => {
  const dynamicMiddleware = createDynamicMiddleware();
  const loaderMiddleware = createLoaderMiddleware();
  const { sagaMiddleware, runSaga } = createSagaMiddleware({
    context: {
      async navigate(to, options) {
        await router.navigate(to, options);
      },
      async fetchContext() {
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
    process.env.NODE_ENV === "development" && top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: `rocker-${BUILD_ID}` })
      : compose;

  const reducer = combineReducers({
    runtime: runtimeReducer,
    shared: sharedReducer,
    localisation: localisationReducer,
    env: envReducer,
    modules: modulesReducer,
  });

  const store = createStore(reducer, {}, composer(applyMiddleware(...enhancers)));
  setStore(store);

  runSaga(getStore(), function* rooSaga() {
    yield all([watchBootstrap(), watchFetchContext(), watchRefresh(), watchModules(), watchChangeLanguage()]);
  });

  return store;
};
