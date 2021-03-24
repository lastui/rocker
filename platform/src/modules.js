import React from "react";
import { Provider } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import HashMap from './struct/map';
import LinkedList from './struct/list';

import * as constants from "./constants";

const SAGAS = "sagas";
const REDUCERS = "reducers";
//const MODULES = "modules";

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

  const modulesCache = new HashMap();
  const availableModules = new HashMap();
  const loadedModules = new HashMap();  // FIXME graph
  const loadingModules = new HashMap();
  const danglingModules = new LinkedList();

  let ready = false;

  const moduleState = {
    //[DANGLING_MODULES]: [],
    [REDUCERS]: {},
    [SAGAS]: {},
  };

  const getLoadedModule = (name) => 
    loadedModules.get(name);

  const setLoadingModule = (name, promise) => {
    loadingModules.set(name, promise);
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
    modulesCache.set(key, value);
    //moduleState[CACHE][key] = value;
    return value;
  };

  const getFromCache = (key) => 
    modulesCache.get(key);
  //moduleState[CACHE][key];

  const clearCache = () => 
    modulesCache.reset();
    //(moduleState[CACHE] = {});

  const setReady = (isReady) => {
    ready = isReady
    //moduleState[READY] = isReady;
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
    loadedModules.set(name, module);
    loadingModules.delete(name);

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

  //const getMountedModules = () => moduleState[MOUNTED_MODULES];

  const setModuleMountState = (name, mounted) => {
    //if (!mounted) {
      //delete moduleState[MOUNTED_MODULES][name];
    console.log('module', name, 'ack unmount')
    if (!loadedModules.has(name)) {
      console.log('module', name, 'is now dangling and needs cleanup');
      //moduleState[DANGLING_MODULES].push(name);
      danglingModules.push(name);
    }
    //} else {
      //console.log('module', name, 'ack mount')
      //moduleState[MOUNTED_MODULES][name] = true;
    //}
  };

  const loadModule = (name) => {
    if (loadedModules.has(name)) {
      return Promise.resolve(getLoadedModule(name));
    }

    if (loadingModules.has(name)) {
      return loadingModules.get(name)
      //return moduleState[LOADING_MODULES][name];
    }

    

    const module = availableModules.get(name); //moduleState[AVAILABLE_MODULES][name];
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
    loadedModules.delete(name);
    console.log("dispatching unload module action", name)
    store.dispatch({
      type: constants.MODULE_UNLOADED,
      payload: {
        name,
      },
    });
  };

  const getReducer = () => {
    return (state = {}, action) => {

      for (let name = danglingModules.pop(); name; name = danglingModules.pop()) {
        console.log('evicting dangling module redux state', name)
        delete state[name];
      }

      if (!ready) {
        return state;
      }

      for (const name in moduleState[REDUCERS]) {
        if (!loadedModules.has(name)) {
          continue;
        }
        state[name] = moduleState[REDUCERS][name](
          state[name],
          action
        );
      }

      return state;
    };
  };

  const isolateStore = (name) => ({
    dispatch: (action) => {
      store.dispatch(action);
    },
    getState: () => {
      const state = store.getState();
      const isolatedState = state.modules[name] || {};
      isolatedState.router = state.router;
      return isolatedState;
    },
    subscribe: function (listener) {
      return store.subscribe(listener);
    },
    replaceReducer: function (newReducer) {
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
      availableModules.reset()
      for (const module of modules) {
        availableModules.set(module.name, module);
      }
      for (const name in loadedModules) {
        if (!availableModules.has(name)) {
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
