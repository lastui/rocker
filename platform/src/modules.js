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

  const loadedModules = {};
  const availableModules = [];
  const loadingModules = {};
  const danglingModules = [];
  const reducers = {};
  const sagas = {};

  let ready = false;

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

  const setReady = (isReady) => {
    ready = isReady;
    store.dispatch({
      type: constants.MODULES_READY,
      payload: {
        isReady,
      },
    });
  };

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
    loadedModules[name] = module;
    delete loadingModules[name];

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

  const setModuleMountState = (name, mounted) => {
    if (!mounted) {
      console.log("module", name, "ack unmount");
      if (!loadedModules[name]) {
        console.log("module", name, "is now dangling and needs cleanup");
        danglingModules.push(name);
      }
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

    if (availableModules.indexOf(name) === -1) {
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
      delete loadingModules[name];
      return Promise.resolve(null);
    });
  };

  const unloadModule = (name) => {
    console.log("unloading module", name);
    removeReducer(name);
    removeSaga(name);
    delete loadedModules[name];
    console.log("dispatching unload module action", name);
    store.dispatch({
      type: constants.MODULE_UNLOADED,
      payload: {
        name,
      },
    });
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

      if (!ready) {
        return state;
      }

      for (const name in reducers) {
        if (!loadedModules[name]) {
          // MUST be O(1)
          continue;
        }
        state[name] = reducers[name](state[name], action);
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
      // FIXME single promise (wait for all)
      setReady(false);
      availableModules = [];
      for (const module of modules) {
        availableModules.push(module.name);
      }
      for (const name in loadedModules) {
        if (availableModules.indexOf(name) !== -1) {
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
