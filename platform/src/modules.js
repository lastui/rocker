import React from "react";
import { Provider } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as constants from "./constants";

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
      return loader
        .setAvailableModules(action.payload.modules)
        .then(() => next(action));
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

  const loadedModules = {};
  const availableModules = {};
  const loadingModules = {};
  const danglingModules = [];
  const reducers = {};
  const sagas = {};

  const getLoadedModule = (name) => loadedModules[name];

  const setLoadingModule = (name, promise) => {
    loadingModules[name] = promise;
    return promise;
  };

  const removeReducer = (name) => {
    delete reducers[name];
  };

  const addReducer = (name, reducer) => {
    removeReducer(name);
    console.log("module", name, "adding reducer");
    reducer({}, { type: constants.MODULE_INIT });
    reducers[name] = reducer;
  };

  const removeSaga = (name) => {
    if (!sagas[name]) {
      return;
    }
    console.log("module", name, "removing saga");
    console.log("before cancel");
    sagaRunner(function* () {
      yield cancel(sagas[name]);
    });
    console.log("after cancel");
    console.log("module", name, "removed saga");
    delete sagas[name];
  };

  const addSaga = (name, saga) => {
    removeSaga(name);
    console.log("module", name, "adding saga");
    sagas[name] = sagaRunner(function* () {
      yield fork(saga);
    });
    console.log("module", name, "added saga");
  };

  const connectModule = (name, scope = {}) => {
    if (scope.reducer) {
      scope.reducer.router = () => ({});
      addReducer(name, combineReducers(scope.reducer));
    }
    if (scope.saga) {
      addSaga(name, scope.saga);
    }
    loadedModules[name] = {
      name,
      root: scope.MainView && isolateModule(name, scope.MainView),
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

  const setModuleMountState = (name, mounted) => {
    if (!mounted) {
      console.log("module", name, "ack unmount");
      if (!loadedModules[name]) {
        console.log("module", name, "is now dangling and needs cleanup");
        danglingModules.push(name);
      }
    } else {
      console.log("module", name, "ack mount");
    }
  };

  const loadModule = (name) => {
    const loaded = loadedModules[name];
    if (loaded) {
      return Promise.resolve(loaded);
    }
    const loading = loadingModules[name];
    if (loading) {
      return loading;
    }
    const module = availableModules[name];
    if (!module) {
      store.dispatch({
        type: constants.MODULE_NOT_AVAILABLE,
        payload: {
          name,
        },
      });
      return Promise.resolve(null);
    }

    const promise = loadModuleFile(module.url).then((data) => {
        connectModule(name, data);
        store.dispatch({
          type: constants.MODULE_LOADED,
          payload: {
            name,
          },
        });
        return getLoadedModule(name);
      })
      .catch((error) => Promise.resolve(null))
      .then((data) => {
        delete loadingModules[name];
        return data;
      });

    return setLoadingModule(name, promise)
  };

  const unloadModule = (name) => {
    console.log("unloading module", name);
    removeSaga(name);
    delete loadedModules[name];
    store.dispatch({
      type: constants.MODULE_UNLOADED,
      payload: {
        name,
      },
    });
    return Promise.resolve(null);
  };

  const setAvailableModules = (modules = []) => {
    // INFO 1.56ms overhead
    //console.log("before availableModules", availableModules);
    //console.log("new available modules will be", modules);
    const promises = [];
    const newModules = {};

    for (let i = modules.length; i--; ) {
      const module = modules[i];
      newModules[module.name] = module;
      availableModules[module.name] = module;
    }

    for (const module in availableModules) {
      if (newModules[module]) {
        //console.log("module", module, "still available");
        continue;
      }
      //console.log("module", module, "will not be available");
      if (loadedModules[module]) {
        //console.log("module", module, "is loaded, unloading");
        promises.push(this.unloadModule(name));
      }
      // FIXME this module could be running right now
      delete availableModules[module];
    }
    //console.log("after availableModules", availableModules);
    return Promise.all(promises);
  };

  const getReducer = () => {
    return (state = {}, action) => {
      for (
        let name = danglingModules.pop();
        name;
        name = danglingModules.pop()
      ) {
        console.log("evicting dangling module redux state", name);
        delete state[name];
      }

      switch (action.type) {
        case constants.MODULE_UNLOADED: {
          console.log("in rocker reducer module unload", action.payload);
          removeReducer(name);
          break;
        }
      }

      for (const name in reducers) {
        state[name] = reducers[name](state[name], action);
      }

      return state;
    };
  };

  const isolateStore = (name) => ({
    dispatch: store.dispatch,
    getState: () => {
      const state = store.getState();
      const isolatedState = state.modules[name] || {};
      isolatedState.router = state.router;
      return isolatedState;
    },
    subscribe: store.subscribe,
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
    setAvailableModules,
    loadModule,
    unloadModule,
    getLoadedModule,
    setModuleMountState,
    getReducer,
  };
};
