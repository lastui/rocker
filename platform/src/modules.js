import React from "react";
import { Provider } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as constants from "./constants";

const LOADED_MODULES = "loadedModules";
const AVAILABLE_MODULES = "availableModules";
const LOADING_MODULES = "loadingModules";
const MOUNTED_MODULES = "mountedModules";
const SAGAS = "sagas";
const REDUCERS = "reducers";
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
      payload: isReady,
    });
  };

  const cachePromise = (cacheKey, promise) =>
    promise.then((data) => Promise.resolve(setCache(cacheKey, data)));

  const connectModule = (name, scope = {}) => {
    //console.log("connecting module", name, "with scope", scope);
    if (scope.reducer) {
      //console.log("adding reducer of", name, "is", scope.reducer);
      scope.reducer.router = () => ({});
      //console.log("after patching router in its", scope.reducer);
      addReducer(name, combineReducers(scope.reducer));
    }
    if (scope.saga) {
      //console.log("adding saga of", name, "is", scope.saga);
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
          //console.log("leak while evaluating sandbox", r);
          return {};
        }
        //console.log('')
        //console.log("sandbox value after evaluation is", sandbox);
        return sandbox.__SANDBOX_SCOPE__;
      });

  const getMountedModules = () => moduleState[MOUNTED_MODULES];

  const setModuleMountState = (name, mounted) => {
    if (!mounted) {
      delete moduleState[MOUNTED_MODULES][name];
    } else {
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
    //console.log("load module", name, "called");

    if (isModuleLoaded(name)) {
      //console.log("module", name, "already loaded");
      return Promise.resolve(getLoadedModule(name));
    }

    console.log("loading module", name);

    if (isModuleLoading(name)) {
      //console.log("module", name, "is currently loading");
      return moduleState[LOADING_MODULES][name];
    }

    const module = getAvailableModule(name);
    if (!module) {
      //console.log("module", name, "is is not available");
      store.dispatch({
        type: constants.MODULE_NOT_AVAILABLE,
        payload: {
          name,
        },
      });
      return Promise.resolve(null);
    }

    //console.log("module", name, "will be loaded");
    return setLoadingModule(
      name,
      loadModuleFile(module.url).then((data) =>
        store.dispatch(connectModule(name, data))
      )
    ).catch((error) => {
      //console.log("load module", name, "error", error);
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
    //const dynamicReducers = getReducers()

    return (state = {}, action) => {
      if (!moduleState[READY]) {
        //console.log("dynamic reducer not ready, not reducing", action);
        return state;
      }

      if (action.type.startsWith("@@module/")) {
        //        console.log('>>> will NOT propagate action', action.type, 'to module reducers')
        return state;
      }

      //const newState = {}

      //console.log('entering iteration of', moduleState[REDUCERS])

      for (const name in moduleState[REDUCERS]) {
        const moduleLoaded = isModuleLoaded(name);

        if (!moduleLoaded) {
          //console.log('>>> will NOT propagate action', action.type, 'to module', name, 'reducer')
          //newState[name] = state[name]
          continue;
        }

        if (action.type.startsWith("@@router/")) {
          //console.log('>>> will propagate action broadcast', action.type, 'to module', name, 'reducer')
          state[name] = moduleState[REDUCERS][name](state[name], action);
        } else if (action.type.startsWith("@" + name + "/")) {
          //console.log('>>> will propagate action module', action.type, 'to module', name, 'reducer')
          state[name] = moduleState[REDUCERS][name](state[name], {
            ...action,
            type: action.type.slice(("@" + name + "/").length),
          });
        }
      }

      return state;
    };
  };

  const isolateModule = (name, Component) => {
    // console.log('isolating module', name)

    class ModuleWrapper extends React.Component {
      shouldComponentUpdate(nextProps, nextState) {
        console.log("checking if", name, "should update");
        console.log("state transition of", this.state, nextState)
        return moduleState[READY] && super.shouldComponentUpdate();
      }

      render() {
        // INFO tracing why flickerring when chaning navigation happens
        console.log('rendering ModuleWrapper of', name)
        return (
          <Provider
            store={{
              dispatch: (action) => {
                if (action.type.startsWith("@@")) {
                  return store.dispatch(action);
                } else {
                  return store.dispatch({
                    ...action,
                    type: "@" + name + "/" + action.type,
                  });
                }
              },
              getState: () => {
                const state = store.getState();
                const isolatedState = state.modules[name] || {};
                isolatedState.router = state.router;
                return isolatedState;
              },
              subscribe: store.subscribe, // FIXME do not listen to other module
              replaceReducer: function (newReducer) {
                addReducer(name, newReducer);
              },
            }}
          >
            <Component {...this.props} />
          </Provider>
        );
      }
    }

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
    addSaga, // FIXME ideally remove
    removeSaga, // FIXME ideally remove
    loadModule,
    unloadModule,
    setModuleMountState,
    getReducer,
  };
};
