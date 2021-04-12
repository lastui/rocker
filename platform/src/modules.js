import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as constants from "./constants";
import * as actions from "./actions";

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
  if (scope.shared) {
    this.shared = scope.shared;
  }
  if (scope.styles) {
    this.styles = scope.styles;
  }
  if (scope.locale) {
    this.locale = scope.locale;
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
    console.error("Sagas runnner not provided!");
  };

  const loadedModules = {};
  const availableModules = {};
  const loadingModules = {};
  const danglingNamespaces = [];
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
    reducer({}, { type: constants.MODULE_INIT });
    reducers[name] = reducer;
  };

  const removeSaga = (name) => {
    if (!sagas[name]) {
      return;
    }
    sagaRunner(function* () {
      yield cancel(sagas[name]);
    });
    delete sagas[name];
  };

  const addSaga = (name, saga) => {
    removeSaga(name);
    sagas[name] = sagaRunner(function* () {
      yield fork(saga);
    });
  };

  const removeShared = (name) => {
    store.dispatch(actions.removeShared(name));
  };

  const addShared = (name, payload) => {
    store.dispatch(actions.addShared(name, payload));
  };

  const removeI18nMessages = (data) => {
    store.dispatch(actions.removeI18nMessages(data));
  };

  const addI18nMessages = (data) => {
    store.dispatch(actions.addI18nMessages(data));
  };

  const connectModule = (name, scope = {}) => {
    if (scope.reducer) {
      console.debug(`module ${name} introducing reducer`);
      addReducer(name, combineReducers(scope.reducer));
    }
    if (scope.saga) {
      console.debug(`module ${name} introducing saga`);
      addSaga(name, scope.saga);
    }
    if (scope.shared) {
      console.debug(`module ${name} introducing shared`);
      addShared(name, scope.shared);
    }
    if (scope.styles) {
      console.debug(`module ${name} introducing styles`);
      scope.styles.use();
    }
    if (scope.locale) {
      console.debug(`module ${name} introducing locales`);
      addI18nMessages(scope.locale)
    }
    loadedModules[name] = {
      name,
      root: scope.MainView && isolateModule(name, scope.MainView),
      cleanup: () => {
        if (scope.style) {
          scope.styles.unuse();
        }
        if (scope.saga) {
          removeSaga(name);
        }
        if (scope.locale) {
          removeI18nMessages(scope.locale);
        }
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
        const r = new Function("with(this) {" + data + ";}").call(sandbox);
        if (r !== undefined) {
          return {};
        }
        return sandbox.__SANDBOX_SCOPE__;
      });

  const setModuleMountState = (name, mounted) => {
    if (!mounted && !loadedModules[name]) {
      danglingNamespaces.push(name);
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

    const promise = loadModuleFile(module.url)
      .then((data) => {
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

    return setLoadingModule(name, promise);
  };

  const unloadModule = (name) => {
    const loaded = loadedModules[name];
    if (loaded) {
      loaded.cleanup();
      delete loadedModules[name];
      store.dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          name,
        },
      });
    }
    return Promise.resolve(null);
  };

  const setAvailableModules = (modules = []) => {
    const promises = [];
    const newModules = {};

    for (let i = modules.length; i--; ) {
      const module = modules[i];
      newModules[module.name] = module;
      availableModules[module.name] = module;
    }

    for (const module in availableModules) {
      if (newModules[module]) {
        continue;
      }
      if (loadedModules[module]) {
        promises.push(unloadModule(module));
      }
      delete availableModules[module];
    }
    return Promise.all(promises);
  };

  const getReducer = () => {
    return (state = {}, action) => {
      for (
        let name = danglingNamespaces.pop();
        name;
        name = danglingNamespaces.pop()
      ) {
        console.debug(`dyn reducer - module's ${name} state evicted`);
        delete state[name];
      }

      switch (action.type) {
        case constants.ADD_SHARED: {
          console.debug(`dyn reducer - add shared (ignore)`);
          return state;
        }
        case constants.REMOVE_SHARED: {
          console.debug(`dyn reducer - remove shared (ignore)`);
          return state;
        }
        case constants.ADD_I18N_MESSAGES: {
          console.debug(`dyn reducer - add i18n messages (ignore)`);
          return state;
        }
        case constants.REMOVE_I18N_MESSAGES: {
          console.debug(`dyn reducer - remove i18n messages (ignore)`);
          return state;
        }
        case constants.SET_AVAILABLE_MODULES: {
          console.debug(`dyn reducer - set available modules (ignore)`);
          return state;
        }
        case constants.MODULE_UNLOADED: {
          console.debug(`dyn reducer - module ${name} unloaded`);
          removeReducer(name);
          return state;
        }
        case constants.INIT: {
          console.debug(`dyn reducer - platform init (ignore)`);
          return state;
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
      isolatedState.shared = state.shared;
      return isolatedState;
    },
    subscribe: store.subscribe,
    replaceReducer: function (newReducer) {
      addReducer(name, newReducer);
    },
  });

  const isolateModule = (name, Component) => {
    const isolatedStore = isolateStore(name);
    const ModuleWrapper = (props) => {
      return (
        <ReactReduxContext.Provider
          value={{
            store: isolatedStore,
          }}
        >
          <Component {...props} />
        </ReactReduxContext.Provider>
      );
    };
    ModuleWrapper.displayName = `ModuleWrapper-${name}`;
    Component.displayName = `Module-${name}`;
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
