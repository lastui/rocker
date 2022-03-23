import React from "react";
import { ReactReduxContext } from "react-redux";
import { cancel, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { downloadProgram } from "./assets";
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

  const addReducer = async (id, reducer) => {
    try {
      removeReducer(id);
      console.debug(`module ${id} introducing reducer`);
      const composedReducer = combineReducers({
        ...reducer,
        shared: (state = {}, _action) => state,
        runtime: (state = {}, _action) => state,
      });
      composedReducer(undefined, { type: constants.MODULE_INIT, module: id });
      reducers[id] = composedReducer;
    } catch (_err) {
      console.warn(`module ${id} wanted to register invalid reducer`);
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
      console.log('saga kill', id, dangling)
      console.log('before canceling saga', id, dangling.isCancelled())
      yield cancel(dangling);
      console.log('after canceling saga', id, dangling.isCancelled())
    });
    delete sagas[id];
  };

  const addSaga = async (id, saga) => {
    removeSaga(id);
    console.debug(`module ${id} introducing saga`);
    sagas[id] = sagaRunner(function* () {
      try {
        // FIXME should use spawn but unable to cancel spawn
        yield fork(saga);
      } catch (error) {
        console.error(`module ${id} saga crashed`, error);
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
        console.debug(`module ${id} cleaning up`)
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
    const promise = downloadProgram(available.program)
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
    await Promise.allSettled(scheduledUnload)
  };

  const getSharedReducer = () => {
    const localeMapping = {};
    return (state = { meta: {}, language: "en-US", messages: {}, updatedAt: 0 }, action) => {
      switch (action.type) {
        case constants.SET_AVAILABLE_MODULES: {
          const meta = {};
          for (const item of action.payload.modules) {
            meta[item.id] = item.meta || {};
          }
          return {
            meta,
            language: state.language,
            messages: state.messages,
            updatedAt: state.updatedAt,
          };
        }
        case constants.MODULE_LOADED:
        case constants.FORCE_UPDATE: {
          return {
            meta: state.meta,
            language: state.language,
            messages: state.messages,
            updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          };
        }
        case constants.ADD_I18N_MESSAGES: {
          console.log('shared ADD_I18N_MESSAGES', 'start state', JSON.stringify(state.messages))

          if (action.payload.batch.length === 0) {
            if (action.payload.language !== state.language) {
              return {
                meta: state.meta,
                language: action.payload.language,
                messages: state.messages,
                updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
              };
            }
            return state;
          }

          const nextMessages = JSON.parse(JSON.stringify(state.messages));  // FIXME better

          for (const patch of action.payload.batch) {
            if (!localeMapping[patch.module]) {
              localeMapping[patch.module] = {};
            }
            if (!nextMessages[action.payload.language]) {
              nextMessages[action.payload.language] = {};
            }
            const addItem = (key, message) => {
              const hash = key.substring(1);
              localeMapping[patch.module][hash] = true;
              nextMessages[action.payload.language][hash] = message;
            };
            const walk = (path, table) => {
              for (const property in table) {
                const item = table[property];
                if (typeof item !== "object") {
                  addItem(`${path}.${property}`, item);
                } else {
                  walk(`${path}.${property}`, item);
                }
              }
            };
            walk("", patch.data);
          }

          console.log('+ messages will update from', JSON.stringify(state.messages), 'to', JSON.stringify(nextMessages));

          return {
            meta: state.meta,
            language: action.payload.language,
            messages: nextMessages,
            updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          };
        }
        case constants.MODULE_UNLOADED: {
          console.log('shared MODULE_UNLOADED (REMOVE_I18N_MESSAGES)', action.payload.module, 'start state', JSON.stringify(state.messages))
          const nextMessages = JSON.parse(JSON.stringify(state.messages));  // FIXME better
          const keys = localeMapping[action.payload.module] || {};
          for (const id in keys) {
            for (const locale in state.messages) {
              delete nextMessages[locale][id];
            }
          }
          delete localeMapping[action.payload.module];

          console.log('- messages will update from', JSON.stringify(state.messages), 'to', JSON.stringify(nextMessages));
          return {
            meta: state.meta,
            language: state.language,
            messages: nextMessages,
            updatedAt: (state.updatedAt + 1) % Number.MAX_SAFE_INTEGER,
          };
        }
        default: {
          return state;
        }
      }
    }
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
        case constants.ADD_I18N_MESSAGES:
        case constants.REMOVE_I18N_MESSAGES:
        case constants.SET_AVAILABLE_MODULES: {
          return state;
        }
        case constants.MODULE_LOADED: {
          const id = action.payload.module;
          console.debug(`module ${id} loaded`);
          if (reducers[id]) {
            try {
              state[id] = reducers[id](state[id], action);
            } catch (_err) {
              console.warn(`module ${id} reducer failed to reduce`);
            }
          }
          return state;
        }
        case constants.MODULE_UNLOADED: {
          const id = action.payload.module
          removeReducer(id);
          console.debug(`module ${id} unloaded`);
          return state;
        }
        default: {
          for (const id in reducers) {
            try {
              state[id] = reducers[id](state[id], action);
            } catch (_err) {
              console.warn(`module ${id} reducer failed to reduce`);
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
          isolatedState.runtime = {
            updatedAt: state.runtime.updatedAt,
          };
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
    getSharedReducer,
  };
};

export default createModuleLoader();
