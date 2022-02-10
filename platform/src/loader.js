import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { downloadProgram, downloadJson } from "./assets";
import * as constants from "./constants";
import * as actions from "./actions";

import { injectMiddleware, ejectMiddleware } from "./middleware";

const createModuleLoader = () => {
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

  const removeMiddleware = (id) => {
    if (!ejectMiddleware(id)) {
      return;
    }
    console.debug(`module ${id} removing middleware`);
  };

  const addReducer = (id, reducer) => {
    try {
      removeReducer(id);
      console.debug(`module ${id} introducing reducer`);
      reducer({}, { type: constants.MODULE_INIT });
      reducers[id] = reducer;
    } catch (_err) {
      console.warn(`module ${id} wanted to register invalid reducer`)
    }
  };

  const addMiddleware = (id, middleware) => {
    if (!injectMiddleware(id, middleware)) {
      return;
    }
    console.debug(`module ${id} introducing middleware`);
  };

  const removeSaga = (id) => {
    if (!sagas[id]) {
      return;
    }
    console.debug(`module ${id} removing saga`);
    const dangling = sagas[id];
    sagaRunner(function* () {
      yield cancel(dangling);
    });
    delete sagas[id];
  };

  const addSaga = (id, saga) => {
    removeSaga(id);
    console.debug(`module ${id} introducing saga`);
    sagas[id] = sagaRunner(function* () {
      yield fork(saga);
    });
  };

  const connectModule = async (id, scope = {}) => {
    const injectedStyles = document.querySelector("style#rocker:last-of-type");
    if (injectedStyles) {
      console.debug(`module ${id} introducing styles`);
      injectedStyles.removeAttribute("id");
      injectedStyles.setAttribute("data-module", id);
    }
    if (scope.reducer) {
      const composedReducer = {
        ...scope.reducer,
        shared: (state = {}, _action) => state,
        runtime: (state = {}, _action) => state,
      };
      addReducer(id, combineReducers(composedReducer));
    }
    if (scope.middleware) {
      await addMiddleware(id, scope.middleware)
    }
    if (scope.saga) {
      addSaga(id, scope.saga);
    }
    return {
      id,
      view: (scope.Main && isolateProgram(id, scope)) || null,
      cleanup: () => {
        const orphanStyles = document.querySelector(`[data-module=${id}`);
        if (orphanStyles) {
          console.debug(`module ${id} removing styles`);
          orphanStyles.remove();
        }
        if (scope.saga) {
          removeSaga(id);
        }
        if (scope.middleware) {
          removeMiddleware(id);
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
    const available = availableModules[id];
    const loaded = loadedModules[id];
    if (!available || !available.program) {
      return Promise.resolve(Boolean(loaded));
    }
    if (loaded) {
      return Promise.resolve(false);
    }
    const loading = loadingModules[id];
    if (loading) {
      return loading;
    }
    const promise = downloadProgram(available.program)
      .then((data) => connectModule(id, data))
      .then((data) => {
        loadedModules[id] = data;
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

  const unloadModule = (item) =>
    new Promise((resolve) => {
      if (!item.id) {
        return resolve(false);
      }
      const loaded = loadedModules[item.id];
      if (loaded) {
        delete loadedModules[item.id];
        store.dispatch({
          type: constants.MODULE_UNLOADED,
          payload: {
            id: item.id,
          },
        });
        if (item.locales) {
          console.debug(`module ${item.id} removing locales`);
          delete loadedLocales[item.id];
          store.dispatch(actions.removeI18nMessages(item.id));
        }
        loaded.cleanup();
      }
      danglingNamespaces.push(item.id);
      return resolve(true);
    });

  const setAvailableModules = (modules = []) => {
    const scheduledUnload = [];
    const newModules = {};
    for (let i = modules.length; i--; ) {
      const item = modules[i];
      newModules[item.id] = item;
      if (!availableModules[item.id] && item.locales) {
        availableLocales[item.id] = item.locales;
      }
      if (!availableModules[item.id]) {
        availableModules[item.id] = item;
      }
    }
    const obsoleteModules = [];
    for (const existing in availableModules) {
      const item = newModules[existing];
      if (item) {
        if (
          item.program?.sha256 !== availableModules[existing].program?.sha256
        ) {
          availableModules[existing] = item;
          scheduledUnload.push(unloadModule(item));
        }
      } else {
        const loaded = loadedModules[existing]
        if (loaded) {
          scheduledUnload.push(unloadModule(loaded));
          obsoleteModules.push(existing);
        }
      }
    }
    for (let i = obsoleteModules.length; i--; ) {
      delete availableModules[obsoleteModules[i]];
      delete availableLocales[obsoleteModules[i]];
    }
    return Promise.all(scheduledUnload);
  };

  const getReducer = () => (state = {}, action) => {
    for (let id = danglingNamespaces.pop(); id; id = danglingNamespaces.pop()) {
      console.debug(`module ${id} evicting redux state`);
      delete state[id];
    }
    switch (action.type) {
      case constants.INIT:
      case constants.ADD_I18N_MESSAGES:
      case constants.REMOVE_I18N_MESSAGES:
      case constants.SET_AVAILABLE_MODULES: {
        return state;
      }
      case constants.MODULE_LOADED: {
        console.debug(`module ${action.payload.id} loaded`);
        return state;
      }
      case constants.MODULE_UNLOADED: {
        removeReducer(action.payload.id);
        console.debug(`module ${action.payload.id} unloaded`);
        return state;
      }
      default: {
        for (const id in reducers) {
          try {
            state[id] = reducers[id](state[id], action);
          } catch (_err) {
            console.warn(`module ${id} reducer failed to reduce`)
          }
        }
        return state;
      }
    }
  };

  const isolateProgram = (id, scope) => {
    const reduxContext = {
      store: {
        dispatch: store.dispatch,
        getState: () => {
          const state = store.getState();
          const isolatedState = {};
          for (const mid in state.modules) {
            if (mid === id) {
              continue
            }
            for (const prop in state.modules[mid]) {
              isolatedState[prop] = state.modules[mid][prop]
            }
          }
          if (state.modules[id]) {
            for (const prop in state.modules[id]) {
              isolatedState[prop] = state.modules[id][prop]
            }
          }
          isolatedState.shared = state.shared;
          isolatedState.runtime = {
            updatedAt: state.runtime.updatedAt,
          };
          return isolatedState;
        },
        subscribe: store.subscribe,
        replaceReducer: function(newReducer) {
          addReducer(id, newReducer);
        },
      },
    };

    const initialState = { error: null };

    class HOC extends React.Component {
      state = initialState;

      static displayName = `Module(${id})`;

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch(error, info) {
        console.error(`module ${id} errored`, error, info);
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.state.error !== nextState.error) {
          return true;
        }
        if (this.props.lastUpdate !== nextProps.lastUpdate) {
          return true;
        }
        for (const key in nextProps.owned) {
          if (this.props.owned[key] !== nextProps.owned[key]) {
            return true;
          }
        }
        return false;
      }

      render() {
        if (this.state.error === null) {
          const composite = { ...this.props.owned, ...scope.props };
          return (
            <ReactReduxContext.Provider value={reduxContext}>
              {this.props.children
                ? React.createElement(
                    scope.Main,
                    composite,
                    this.props.children
                  )
                : React.createElement(scope.Main, composite)}
            </ReactReduxContext.Provider>
          );
        }
        if (scope.Error) {
          return React.createElement(scope.Error, this.state);
        }
        return null;
      }
    }

    return HOC;
  };

  const loadLocales = (language) => {
    const promises = [];
    for (const id in availableLocales) {
      promises.push(loadLocale(id, language));
    }
    return Promise.allSettled(promises);
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
    getLoadedModule,
    getReducer,
  };
};

export default createModuleLoader();
