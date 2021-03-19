import React from "react";
import { Provider } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as constants from "./constants";

const LOADED_MODULES = "loadedModules";
const AVAILABLE_MODULES = "availableModules";
const LOADING_MODULES = "loadingModules";
const MOUNTED_MODULES = "mountedModules";
const DANGLING_MODULES = "danglingModules";
const SAGAS = "sagas";
const REDUCERS = "reducers";
const MODULES = "modules";
const CACHE = "cache";
const READY = "ready";

export function registerModule(scope) {
  if (scope.MainView) {
    this.MainView = scope.MainView;
  }
  if (scope.reducer) {
    this.reducer = scope.reducer;
  }
  if (scope.saga) {
    this.saga = scope.saga;
  }
}

export const moduleLoaderMiddleware = (loader) => (store) => (next) => (
  action
) => {
  switch (action.type) {
    case constants.SET_AVAILABLE_MODULES: {
      return loader.setAvailableModules(action.payload.modules);
    }
    case constants.SET_ENTRYPOINT_MODULE: {
      return loader
        .loadModule(action.payload.entrypoint)
        .then(() => next(action));
    }
    default: {
      return next(action);
    }
  }
};

export const createModuleLoader = () => {
  let store = {
    dispatch() {
      console.error("Redux store is not provided!");
    },
    getState() {
      console.error("Redux store is not provided!");
      return {};
    },
    subscribe() {
      console.error("Redux store is not provided!");
    },
  };

  let sagaRunner = () => {
    console.log("Sagas runnner not provided!");
  };

  const moduleState = {
    [CACHE]: {},
    [AVAILABLE_MODULES]: {},
    [LOADED_MODULES]: {},
    [LOADING_MODULES]: {},
    [DANGLING_MODULES]: [],
    [MOUNTED_MODULES]: {},
    [READY]: true,
    [REDUCERS]: {},
    [SAGAS]: {},
  };

  const getAvailableModules = () => moduleState[AVAILABLE_MODULES];

  const getAvailableModule = (name) => moduleState[AVAILABLE_MODULES][name];

  const getLoadedModules = () => moduleState[LOADED_MODULES];

  const getLoadedModule = (name) => moduleState[LOADED_MODULES][name];

  const getLoadingModules = () => moduleState[LOADING_MODULES];

  const setLoadingModule = (name, promise) => {
    moduleState[LOADING_MODULES][name] = promise;
    return promise;
  };

  const getReducers = () => moduleState[REDUCERS];

  const removeReducer = (name) => {
    if (!moduleState[REDUCERS][name]) {
      return;
    }
    console.log("module", name, "removing reducer");
    delete moduleState[REDUCERS][name];
  };

  const addReducer = (name, reducer) => {
    removeReducer(name);
    console.log("module", name, "adding reducer");
    reducer({}, { type: constants.MODULE_INIT });
    moduleState[REDUCERS][name] = reducer;
  };

  const removeSaga = (name) => {
    if (!moduleState[SAGAS][name]) {
      return;
    }
    console.log("module", name, "removing saga");
    console.log("before cancel");
    sagaRunner(function* () {
      yield cancel(moduleState[SAGAS][name]);
    });
    console.log("after cancel");
    console.log("module", name, "removed saga");
    delete moduleState[SAGAS][name];
  };

  const addSaga = (name, saga) => {
    removeSaga(name);
    console.log("module", name, "adding saga");
    moduleState[SAGAS][name] = sagaRunner(function* () {
      yield fork(saga);
    });
    console.log("module", name, "added saga");
  };

  const setCache = (key, value) => {
    moduleState[CACHE][key] = value;
    return value;
  };

  const getFromCache = (key) => moduleState[CACHE][key];

  const clearCache = () => (moduleState[CACHE] = {});

  const setReady = (isReady) => {
    moduleState[READY] = isReady;
    store.dispatch({
      type: constants.MODULES_READY,
      payload: {
        isReady,
      },
    });
  };

  const cachePromise = (cacheKey, promise) =>
    promise.then((data) => Promise.resolve(setCache(cacheKey, data)));

  const connectModule = (name, scope = {}) => {
    if (scope.reducer) {
      scope.reducer.router = () => ({});
      addReducer(name, combineReducers(scope.reducer));
    }
    if (scope.saga) {
      addSaga(name, scope.saga);
    }
    const module = {
      name,
      root: scope.MainView && isolateModule(name, scope.MainView),
    };
    moduleState[LOADED_MODULES][name] = module;
    delete moduleState[LOADING_MODULES][name];

    return {
      type: constants.MODULE_LOADED,
      payload: {
        name,
      },
    };
  };

  const loadModuleFile = (uri) =>
    fetch(uri)
      .then((data) => data.text())
      .then((data) => {
        let sandbox = {
          __SANDBOX_SCOPE__: {},
        };
        // FIXME try without "with(this)"
        const r = new Function("with(this) {" + data + ";}").call(sandbox);
        if (r !== undefined) {
          return {};
        }
        return sandbox.__SANDBOX_SCOPE__;
      });

  const getMountedModules = () => moduleState[MOUNTED_MODULES];

  const setModuleMountState = (name, mounted) => {
    if (!mounted) {
      delete moduleState[MOUNTED_MODULES][name];
      console.log('module', name, 'ack unmount')
      if (!moduleState[LOADED_MODULES][name]) {
        console.log('module', name, 'is now dangling and needs cleanup');
        moduleState[DANGLING_MODULES].push(name);
      }
    } else {
      console.log('module', name, 'ack mount')
      moduleState[MOUNTED_MODULES][name] = true;
    }
  };

  const isModuleLoaded = (name) =>
    moduleState[LOADED_MODULES][name] !== undefined;

  const isModuleMounted = (name) => moduleState[MOUNTED_MODULES][name];

  const isModuleLoading = (name) =>
    moduleState[LOADING_MODULES][name] !== undefined;

  const isModuleAvailable = (name) =>
    moduleState[AVAILABLE_MODULES][name] !== undefined;

  const loadModule = (name) => {
    if (isModuleLoaded(name)) {
      return Promise.resolve(getLoadedModule(name));
    }

    console.log("loading module", name);

    if (isModuleLoading(name)) {
      return moduleState[LOADING_MODULES][name];
    }

    const module = getAvailableModule(name);
    if (!module) {
      store.dispatch({
        type: constants.MODULE_NOT_AVAILABLE,
        payload: {
          name,
        },
      });
      return Promise.resolve(null);
    }

    return setLoadingModule(
      name,
      loadModuleFile(module.url).then((data) => {
        store.dispatch(connectModule(name, data));
        return getLoadedModule(name);
      })
    ).catch((error) => {
      delete moduleState[LOADING_MODULES][name];
      return Promise.resolve(null);
    });
  };

  const unloadModule = (name) => {
    console.log("unloading module", name);
    removeReducer(name);
    removeSaga(name);
    delete moduleState[LOADED_MODULES][name];
    store.dispatch({
      type: constants.MODULE_UNLOADED,
      payload: {
        name,
      },
    });
  };

  const getReducer = () => {
    return (state = {}, action) => {
      console.log("platform reducer observed", action);

      while (moduleState[DANGLING_MODULES].length) {
        const name = moduleState[DANGLING_MODULES].pop()
        console.log('evicting dangling module redux state', name)
        delete state[name];
      }

      if (!moduleState[READY]) {
        return state;
      }

      for (const name in moduleState[REDUCERS]) {
        const moduleLoaded = isModuleLoaded(name);
        if (!moduleLoaded) {
          continue;
        }
        console.log("before changing state of", name);
        state[name] = moduleState[REDUCERS][name](
          state[name],
          action
        );
        console.log("after changing state of", name);
      }

      return state;
    };
  };

  const isolateStore = (name) => ({
    dispatch: (action) => {
      console.log("dispatch", name, "action", action.type);
      store.dispatch(action);
    },
    getState: () => {
      console.log("get state called for", name);
      const state = store.getState();
      console.log("global state is", state);
      const isolatedState = state[MODULES][name] || {};
      isolatedState.router = state.router;
      return isolatedState;
    },
    subscribe: function (listener) {
      console.log("module", name, "wanted to subscribe", listener);
      return store.subscribe(listener);
    },
    replaceReducer: function (newReducer) {
      console.log("replaceReducer called for", name);
      addReducer(name, newReducer);
    },
  });

  const isolateModule = (name, Component) => {
    const isolatedStore = isolateStore(name);
    const ModuleWrapper = (props) => (
      <Provider store={isolatedStore}>
        <Component {...props} />
      </Provider>
    );
    console.log("isolatedModule for", name, "will be", ModuleWrapper);
    return ModuleWrapper;
  };

  return {
    setSagaRunner(nextSagaRunner) {
      if (nextSagaRunner) {
        sagaRunner = nextSagaRunner;
      }
    },
    setStore(nextStore) {
      if (nextStore) {
        store = nextStore;
      }
    },
    setAvailableModules(modules = []) {
      setReady(false);
      moduleState[AVAILABLE_MODULES] = {};
      for (const module of modules) {
        moduleState[AVAILABLE_MODULES][module.name] = module;
      }
      for (const name in moduleState[LOADED_MODULES]) {
        if (!isModuleAvailable(name)) {
          this.unloadModule(name);
        }
      }
      setReady(true);
    },
    loadModule,
    unloadModule,
    getLoadedModule,
    setModuleMountState,
    getReducer,
  };
};
