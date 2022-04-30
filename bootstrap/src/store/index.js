import { Store, applyMiddleware, compose, legacy_createStore, combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import { runtimeReducer } from "../reducer";
import { watchRefresh, watchFetchContext, watchBootstrap } from "../saga";
import {
  setSagaRunner,
  setStore,
  sharedReducer,
  modulesReducer,
  moduleLoaderMiddleware,
  dynamicMiddleware,
  createSagaMiddleware,
} from "@lastui/rocker/platform";

export default (fetchContext, bootstrapMiddlewares) => {
  const { sagaMiddleware, runSaga } = createSagaMiddleware({
    context: {
      fetchContext,
    },
  });

  const enhancers = [moduleLoaderMiddleware, sagaMiddleware, ...(bootstrapMiddlewares || []), dynamicMiddleware];

  const composer =
    process.env.NODE_ENV === "development" ? require("@redux-devtools/extension").composeWithDevTools : compose;

  const reducer = combineReducers({
    runtime: runtimeReducer,
    shared: sharedReducer,
    modules: modulesReducer,
  });

  const store = legacy_createStore(reducer, {}, composer(...[applyMiddleware(...enhancers)]));
  setStore(store);

  const sagas = [watchBootstrap, watchFetchContext, watchRefresh];
  runSaga(store, function* rooSaga() {
    yield all(sagas.map(fork));
  });

  return store;
};