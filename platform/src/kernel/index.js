import "regenerator-runtime/runtime";

/* istanbul ignore file */
import Module from "../component/Module";
import * as constants from "../constants";
import registerModule from "../register";

import createDynamicMiddleware from "./middleware/dynamic";
import createLoaderMiddleware from "./middleware/loader";
import createSagaMiddleware from "./middleware/saga";
import envReducer from "./reducer/env";
import modulesReducer from "./reducer/modules";
import sharedReducer from "./reducer/shared";
import { downloadAsset } from "./registry/assets";
import { manualCleanup } from "./registry/loader";
import { getStore, setStore } from "./registry/store";

export {
  Module,
  constants,
  createLoaderMiddleware,
  sharedReducer,
  envReducer,
  modulesReducer,
  createDynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
  manualCleanup,
  downloadAsset,
};

export default {
  Module,
  constants,
  createLoaderMiddleware,
  sharedReducer,
  envReducer,
  modulesReducer,
  createDynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
  manualCleanup,
  downloadAsset,
};
