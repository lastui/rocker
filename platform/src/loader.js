import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { downloadProgram, downloadJson } from './assets';
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
        runtime: (state = {}, action) => state,
      };
      addReducer(id, combineReducers(composedReducer));
    }
    if (scope.saga) {
      console.debug(`module ${id} introducing saga`);
      addSaga(id, scope.saga);
    }
    return {
      id,
      mainView: (scope.Main && isolateProgram(id, scope.props, scope.Main)) || null,
      errorView: scope.Error || null,
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
    const promise = downloadJson(uri)
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
      return Promise.resolve(false);
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
      return Promise.resolve(false);
    }
    const promise = downloadProgram(item.program, item.sha256)
      .then((data) => {
        loadedModules[id] = connectModule(id, data.program);
        store.dispatch({
          type: constants.MODULE_LOADED,
          payload: {
            id,
          },
        });
        return true;
      })
      .catch((error) => {
        console.error(`module ${id} failed to load`, error);
        return Promise.resolve(false);
      })
      .then((changed) => {
        delete loadingModules[id];
        return changed;
      });
    loadingModules[id] = promise;
    return promise;
  };

  const unloadModule = (item) => {
    if (!item) {
      return Promise.resolve(true);
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
    danglingNamespaces.push(item.id);
    return Promise.resolve(true);
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
    }
    const obsoleteModules = [];
    for (const existing in availableModules) {
      const item = newModules[existing]
      if (item) {
        if (item.sha256 !== availableModules[existing].sha256) {
          availableModules[existing] = item;
          promises.push(unloadModule(existing));
        }
      } else if (loadedModules[existing]) {
        promises.push(unloadModule(existing));
        obsoleteModules.push(existing);
      }
    }
    for (const obsolete of obsoleteModules) {
      delete availableModules[obsolete];
      delete availableLocales[obsolete];
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

  const isolateProgram = (id, declaredProps, component) => {
    const reduxContext = {
      store: {
        dispatch: store.dispatch,
        getState: () => {
          const state = store.getState();
          const isolatedState = state.modules[id] || {};
          isolatedState.shared = state.shared;
          isolatedState.runtime = {
            updatedAt: state.runtime.updatedAt,
          };
          return isolatedState;
        },
        subscribe: store.subscribe,
        replaceReducer: function (newReducer) {
          addReducer(id, newReducer);
        },
      },
    };
  
    return React.memo(
      (props) => {
        const composite = { ...props.owned, ...declaredProps }
        return (
          <ReactReduxContext.Provider value={reduxContext}>
            {props.children
              ? React.createElement(component, composite, props.children)
              : React.createElement(component, composite)
            }
          </ReactReduxContext.Provider>
        )
      },
      (prevProps, nextProps) => {
        if (prevProps.lastUpdate !== nextProps.lastUpdate) {
          return false
        }
        if (!prevProps.name && nextProps.name) {
          return true
        }
        for (const key of Object.keys(nextProps.owned)) {
          if (prevProps.owned[key] !== nextProps.owned[key]) {
            return false
          }
        }
        return true
      }
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
    getReducer,
  };
};
