import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { download } from './assets';
import * as constants from "./constants";
import * as actions from "./actions";

export default () => {
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

  const availableLocales = {};
  const availableModules = {};
  const loadingLocales = {};
  const loadedModules = {};
  const loadedLocales = {};
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
      mainView: scope.Main && isolateModule(id, scope.props, scope.Main),
      errorView: scope.Error,
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

  const loadLocaleFile = (uri) => download(uri).then((data) => data.json());

  const loadModuleFile = (uri) =>
    download(uri)
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
            Main: () => {
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

  const loadLocale = (id, language) => {
    if (
      !availableLocales[id][language] ||
      (loadedLocales[id] && loadedLocales[id][language])
    ) {
      return Promise.resolve(null);
    }
    const uri = availableLocales[id][language];
    const loading = loadingLocales[uri];
    if (loading) {
      return loading;
    }
    const promise = loadLocaleFile(uri)
      .then((data) => {
        console.debug(`module ${id} introducing ${language} locales`);
        if (!loadedLocales[id]) {
          loadedLocales[id] = {};
        }
        loadedLocales[id][language] = true;
        delete loadingLocales[uri];
        store.dispatch(actions.addI18nMessages(id, language, data));
      })
      .catch(() => {
        delete loadingLocales[uri];
        return Promise.resolve(null);
      });
    loadingLocales[uri] = promise;
    return promise;
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
    if (!item || !item.program) {
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
        delete loadedLocales[item.id];
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
        availableLocales[item.id] = item.locales;
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
      delete availableLocales[item];
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

  const isolateModule = (id, declaredProps, component) => {
    const reduxContext = {
      store: {
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
      },
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

  const loadLocales = (language) => {
    const promises = [];
    for (const id in availableLocales) {
      promises.push(loadLocale(id, language));
    }
    return Promise.all(promises);
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
    loadLocales,
    loadModule,
    unloadModule,
    getLoadedModule,
    setModuleMountState,
    getReducer,
  };
};