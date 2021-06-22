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
  if (scope.ErrorView) {
    this.ErrorView = scope.ErrorView;
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
    if (!reducers[id]) {
      return;
    }
    console.debug(`module ${id} removing reducer`);
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

  const connectModule = (id, scope = {}) => {
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
      };
      addReducer(id, combineReducers(composedReducer));
    }
    if (scope.saga) {
      console.debug(`module ${id} introducing saga`);
      addSaga(id, scope.saga);
    }
    return {
      id,
      mainView:
        scope.MainView && isolateModule(id, scope.props, scope.MainView),
      errorView: scope.ErrorView,
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
      },
    };
  };

  const loadLocaleFile = (uri) => fetch(uri).then((data) => data.json());

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
    const promise = loadModuleFile(item.program)
      .then((data) => {
        loadedModules[id] = connectModule(id, data);
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
        return Promise.resolve(null);
      })
      .then((data) => {
        delete loadingModules[id];
        return data;
      });
    loadingModules[id] = promise;
    return promise;
  };

  const unloadModule = (item) => {
    if (!item) {
      return;
    }
    const loaded = loadedModules[item.id];
    if (loaded) {
      loaded.cleanup();
      if (item.locales) {
        console.debug(`module ${item.id} removing locales`);
        store.dispatch(actions.removeI18nMessages(item.id));
      }
      delete loadedModules[item.id];
      store.dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          id: item.id,
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
      if (!availableModules[item.id] && item.locales) {
        promises.push(
          loadLocaleFile(item.locales)
            .then((data) => {
              console.debug(`module ${item.id} introducing locales`);
              store.dispatch(actions.addI18nMessages(item.id, data));
            })
            .catch(() => Promise.resolve(null))
        );
      }
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
    for (const item of obsoleteModules) {
      promises.push(unloadModule(availableModules[item]));
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
        case constants.ADD_I18N_MESSAGES:
        case constants.REMOVE_I18N_MESSAGES:
        case constants.SET_AVAILABLE_MODULES: {
          return state;
        }
        case constants.MODULE_UNLOADED: {
          removeReducer(action.payload.id);
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
    };
    return (props) => (
      <ReactReduxContext.Provider value={reduxContext}>
        {React.createElement(
          component,
          { ...props, ...declaredProps },
          props.children
        )}
      </ReactReduxContext.Provider>
    );
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
