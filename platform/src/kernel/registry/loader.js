import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, spawn } from "redux-saga/effects";
import { combineReducers } from "redux";
import { downloadProgram } from "./assets";
import { injectMiddleware, ejectMiddleware } from "../middleware/dynamic";
import * as constants from "../../constants";
import { warning } from '../../utils';

const createModuleLoader = () => {
  let store = {
    dispatch() {
      warning("Redux store is not provided!");
    },
    getState() {
      warning("Redux store is not provided!");
      return {};
    },
    subscribe() {
      warning("Redux store is not provided!");
    },
  };

  let sagaRunner = () => {
    warning("Sagas runnner is not provided!");
  };

  const availableModules = {};
  const loadedModules = {};
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

  const addReducer = async (id, reducer) => {
    try {
      removeReducer(id);
      console.debug(`module ${id} introducing reducer`);
      const emptydict = {}
      const composedReducer = combineReducers({
        ...reducer,
        shared: (_state, _action) => emptydict,
        runtime: (_state, _action) => emptydict,
      });
      composedReducer(undefined, { type: constants.MODULE_INIT, module: id });
      reducers[id] = composedReducer;
    } catch (error) {
      warning(`module ${id} wanted to register invalid reducer`, error);
    }
  };

  const removeMiddleware = (id) => {
    if (!ejectMiddleware(id)) {
      return;
    }
    console.debug(`module ${id} removing middleware`);
  };

  const addMiddleware = async (id, middleware) => {
    const ok = await injectMiddleware(id, middleware);
    if (!ok) {
      return;
    }
    console.debug(`module ${id} introducing middleware`);
  };

  const removeStyles = (id) => {
    const orphanStyles = document.querySelector(`[data-module=${id}`);
    if (!orphanStyles) {
      return;
    }
    console.debug(`module ${id} removing styles`);
    orphanStyles.remove();
  };

  const addStyles = async (id) => {
    const injectedStyles = document.querySelector("style#rocker:last-of-type");
    if (!injectedStyles) {
      return;
    }
    console.debug(`module ${id} introducing styles`);
    injectedStyles.removeAttribute("id");
    injectedStyles.setAttribute("data-module", id);
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

  const addSaga = async (id, saga) => {
    removeSaga(id);
    console.debug(`module ${id} introducing saga`);
    sagaRunner(function* () {
      try {
        sagas[id] = yield spawn(saga);
      } catch (error) {
        warning(`module ${id} saga crashed`, error);
      }
    });
  };

  const adaptModule = async (id, scope = {}) => {
    const adaptationWork = [];
    adaptationWork.push(addStyles(id));
    if (scope.reducer) {
      adaptationWork.push(addReducer(id, scope.reducer));
    }
    if (scope.middleware) {
      adaptationWork.push(addMiddleware(id, scope.middleware));
    }
    if (scope.saga) {
      adaptationWork.push(addSaga(id, scope.saga));
    }
    await Promise.all(adaptationWork);
    return {
      id,
      view: (scope.Main && isolateProgram(id, scope)) || null,
      cleanup: () => {
        removeStyles(id);
        if (scope.saga) {
          removeSaga(id);
        }
        if (scope.middleware) {
          removeMiddleware(id);
        }
      },
    };
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
    const promise = downloadProgram(id, available.program)
      .then((data) => adaptModule(id, data))
      .then((data) => {
        if (!availableModules[id]) {
          data.cleanup();
          return true;
        }
        loadedModules[id] = data;
        store.dispatch({
          type: constants.MODULE_LOADED,
          payload: {
            module: id,
          },
        });
        return true;
      })
      .catch((error) => {
        warning(`module ${id} failed to load`, error);
        return Promise.resolve(false);
      })
      .then((changed) => {
        delete loadingModules[id];
        return changed;
      });
    loadingModules[id] = promise;
    return promise;
  };

  const unloadModule = (id) =>
    new Promise((resolve) => {
      if (!id) {
        return resolve(false);
      }
      danglingNamespaces.push(id);
      const loaded = loadedModules[id];
      if (loaded) {
        loaded.cleanup();
      }
      delete loadedModules[id];
      store.dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          module: id,
        },
      });
      return resolve(true);
    });

  const setAvailableModules = async (modules = []) => {
    const scheduledUnload = [];
    const newModules = {};
    for (let i = modules.length; i--; ) {
      const item = modules[i];
      newModules[item.id] = item;
      if (!availableModules[item.id]) {
        availableModules[item.id] = item;
      }
    }
    const obsoleteModules = [];
    for (const existing in availableModules) {
      const item = newModules[existing];
      if (!item) {
        const loaded = loadedModules[existing];
        obsoleteModules.push(existing);
        if (loaded) {
          scheduledUnload.push(unloadModule(existing));
        }
      }
    }
    for (let i = obsoleteModules.length; i--; ) {
      delete availableModules[obsoleteModules[i]];
    }
    await Promise.allSettled(scheduledUnload);
  };

  const getModulesReducer =
    () =>
    (state = {}, action) => {
      for (
        let id = danglingNamespaces.pop();
        id;
        id = danglingNamespaces.pop()
      ) {
        console.debug(`module ${id} evicting redux state`);
        delete state[id];
      }
      switch (action.type) {
        case constants.INIT:
        case constants.REFRESH:
        case constants.FETCH_CONTEXT:
        case constants.ADD_I18N_MESSAGES:
        case constants.REMOVE_I18N_MESSAGES:
        case constants.MODULE_LOADED:
        case constants.SET_AVAILABLE_MODULES: {
          return state;
        }
        case constants.MODULE_READY: {
          const id = action.payload.module;
          console.debug(`module ${id} ready`);
          if (reducers[id]) {
            try {
              state[id] = reducers[id](state[id], action);
            } catch (error) {
              warning(`module ${id} reducer failed to reduce`, error);
            }
          }
          console.log(`+ module ${id}`);
          return state;
        }
        case constants.MODULE_UNLOADED: {
          const id = action.payload.module;
          removeReducer(id);
          console.debug(`module ${id} unloaded`);
          console.log(`- module ${id}`);
          return state;
        }
        default: {
          for (const id in reducers) {
            try {
              state[id] = reducers[id](state[id], action);
            } catch (error) {
              warning(`module ${id} reducer failed to reduce`, error);
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
              continue;
            }
            for (const prop in state.modules[mid]) {
              isolatedState[prop] = state.modules[mid][prop];
            }
          }
          if (state.modules[id]) {
            for (const prop in state.modules[id]) {
              isolatedState[prop] = state.modules[id][prop];
            }
          }
          isolatedState.shared = state.shared;
          return isolatedState;
        },
        subscribe: store.subscribe,
        replaceReducer: function (newReducer) {},
      },
    };

    const initialState = { error: null };

    class HOC extends React.Component {
      state = initialState;

      static displayName = `Module(${id})`;

      static getDerivedStateFromError(error) {
        return { error };
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
    getLoadedModule,
    getModulesReducer,
  };
};

export default createModuleLoader();
