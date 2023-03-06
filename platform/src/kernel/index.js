/* istanbul ignore file */
import * as constants from "../constants";

import registerModule from "../register";

import createLoaderMiddleware from "./middleware/loader";
import createSagaMiddleware from "./middleware/saga";
import createDynamicMiddleware from "./middleware/dynamic";
import { getStore, setStore } from "./registry/store";
import moduleLoader from "./registry/loader";
import { manualCleanup } from "./registry/loader";
import sharedReducer from "./reducer/shared";
import modulesReducer from "./reducer/modules";

import Module from "../component/Module";

export {
  Module,
  constants,
  createLoaderMiddleware,
  sharedReducer,
  modulesReducer,
  createDynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
  manualCleanup,
};

export default {
  Module,
  constants,
  createLoaderMiddleware,
  sharedReducer,
  modulesReducer,
  createDynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
  manualCleanup,
};