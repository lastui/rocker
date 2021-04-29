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
  if (scope.props) {
    this.props = scope.props;
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
    console.error("Sagas runnner is not provided!");
  };

  const loadedModules = {};
  const availableModules = {};
  const loadingModules = {};
  const danglingNamespaces = [];
  const reducers = {};
  const sagas = {};

  const getLoadedModule = (id) => loadedModules[id];

  const removeReducer = (id) => {
    delete reducers[id];
  };

  const addReducer = (id, reducer) => {
    removeReducer(id);
    reducer({}, { type: constants.MODULE_INIT });
    reducers[id] = reducer;
  };

  const removeSaga = (id) => {
    if (!sagas[id]) {
      return;
    }
    sagaRunner(function* () {
      yield cancel(sagas[id]);
    });
    delete sagas[id];
  };

  const addSaga = (id, saga) => {
    removeSaga(id);
    sagas[id] = sagaRunner(function* () {
      yield fork(saga);
    });
  };

  const removeI18nMessages = (data) => {
    store.dispatch(actions.removeI18nMessages(data));
  };

  const addI18nMessages = (data) => {
    store.dispatch(actions.addI18nMessages(data));
  };

  const connectModule = (id, props = {}, scope = {}) => {
    const injectedStyles = document.querySelector("style#rocker:last-of-type");
    if (injectedStyles) {
      console.debug(`module ${id} introducing styles`);
      injectedStyles.removeAttribute("id");
      injectedStyles.setAttribute("data-module", id);
    }
    if (scope.reducer) {
      console.debug(`module ${id} introducing reducer`);
      const composedReducer = {
        ...scope.reducer,
        shared: (state = {}, action) => state,
      }
      addReducer(id, combineReducers(composedReducer));
    }
    if (scope.saga) {
      console.debug(`module ${id} introducing saga`);
      addSaga(id, scope.saga);
    }
    if (scope.locale) {
      console.debug(`module ${id} introducing locales`);
      addI18nMessages(scope.locale);
    }
    return {
      id,
      root: scope.MainView && isolateModule(id, props, scope.MainView),
      cleanup: () => {
        const orphanStyles = document.querySelector(`[data-module=${id}`);
        if (orphanStyles) {
          console.debug(`module ${id} removing styles`);
          orphanStyles.remove();
        }
        if (scope.saga) {
          console.debug(`module ${id} removing saga`);
          removeSaga(id);
        }
        if (scope.locale) {
          console.debug(`module ${id} removing locales`);
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
        try {
          const r = new Function("with(this) {" + data + ";}").call(sandbox);
          if (r !== undefined) {
            return {};
          }
        } catch (err) {
          return {
            MainView: () => {
              throw err;
            },
          };
        }
        return sandbox.__SANDBOX_SCOPE__;
      });

  const setModuleMountState = (name, mounted) => {
    switch (mounted) {
      case true: {
        break;
      }
      case false: {
        if (!loadedModules[name] && !loadingModules[name]) {
          danglingNamespaces.push(name);
        }
        break;
      }
    }
  };

  const loadModule = (id) => {
    const loaded = loadedModules[id];
    if (loaded) {
      return Promise.resolve(loaded);
    }
    const loading = loadingModules[id];
    if (loading) {
      return loading;
    }
    const item = availableModules[id];
    if (!item) {
      store.dispatch({
        type: constants.MODULE_NOT_AVAILABLE,
        payload: {
          id,
        },
      });
      console.warn(`module ${id} not available`);
      return Promise.resolve(null);
    }
    const promise = loadModuleFile(item.url)
      .then((data) => {
        loadedModules[id] = connectModule(id, item.props, data);
        store.dispatch({
          type: constants.MODULE_LOADED,
          payload: {
            id,
          },
        });
        return loadedModules[id];
      })
      .catch((error) => {
        console.error(`module ${id} failed to load`, error);
        return Promise.resolve(null)
      })
      .then((data) => {
        delete loadingModules[id];
        return data;
      });
    loadingModules[id] = promise;
    return promise;
  };

  const unloadModule = (id) => {
    const loaded = loadedModules[id];
    if (loaded) {
      loaded.cleanup();
      delete loadedModules[id];
      store.dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          id,
        },
      });
    }
    return Promise.resolve(null);
  };

  const setAvailableModules = (modules = []) => {
    const promises = [];
    const newModules = {};
    for (let i = modules.length; i--; ) {
      const item = modules[i];
      newModules[item.id] = item;
      availableModules[item.id] = item;
    }
    const obsoleteModules = [];
    for (const item in availableModules) {
      if (newModules[item]) {
        continue;
      }
      if (loadedModules[item]) {
        obsoleteModules.push(item);
      }
    }
    for (const item in obsoleteModules) {
      promises.push(unloadModule(item));
      delete availableModules[item];
    }
    return Promise.all(promises);
  };

  const getReducer = () => {
    return (state = {}, action) => {
      for (
        let id = danglingNamespaces.pop();
        id;
        id = danglingNamespaces.pop()
      ) {
        console.debug(`dyn reducer - module's ${id} state evicted`);
        delete state[id];
      }
      switch (action.type) {
        case constants.INIT:
        case constants.ADD_SHARED:
        case constants.REMOVE_SHARED:
        case constants.ADD_I18N_MESSAGES:
        case constants.REMOVE_I18N_MESSAGES:
        case constants.SET_AVAILABLE_MODULES: {
          return state;
        }
        case constants.MODULE_UNLOADED: {
          console.debug(`module ${id} removing reducer`);
          removeReducer(id);
          return state;
        }
      }
      for (const id in reducers) {
        state[id] = reducers[id](state[id], action);
      }
      return state;
    };
  };

  const isolateStore = (id) => ({
    dispatch: store.dispatch,
    getState: () => {
      const state = store.getState();
      const isolatedState = state.modules[id] || {};
      isolatedState.shared = state.shared;
      return isolatedState;
    },
    subscribe: store.subscribe,
    replaceReducer: function (newReducer) {
      addReducer(id, newReducer);
    },
  });

  const isolateModule = (id, declaredProps, component) => {
    const reduxContext = {
      store: isolateStore(id),
    }
    const ModuleWrapper = (props) => (
      <ReactReduxContext.Provider value={reduxContext}>
        {React.createElement(component, declaredProps, props.children)}
      </ReactReduxContext.Provider>
    );
    ModuleWrapper.displayName = `ModuleWrapper-${id}`;
    component.displayName = `Module-${id}`;
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
