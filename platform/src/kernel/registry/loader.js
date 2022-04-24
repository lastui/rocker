import React from "react";
import { ReactReduxContext } from "react-redux";
import { useReduxContext } from "react-redux/es/hooks/useReduxContext.js";
import { downloadProgram } from "./assets";
import * as constants from "../../constants";
import { warning } from "../../utils";
import { addReducer, removeReducer } from "./reducer";
import { addSaga, removeSaga } from "./saga";
import { addMiddleware, removeMiddleware } from "./middleware";
import { getStore } from "./store";
import { addStyles, removeStyles } from "./styles";

const createModuleLoader = () => {
  const store = getStore();

  const availableModules = {};
  const loadedModules = {};
  const loadingModules = {};

  const getLoadedModule = (id) => loadedModules[id];

  const adaptModule = async (id, scope = {}) => {
    const cleanup = () => {
      if (scope.BUILD_ID) {
        removeStyles(id, scope.BUILD_ID);
      }
      if (scope.saga) {
        removeSaga(id);
      }
      if (scope.middleware) {
        removeMiddleware(id);
      }
      if (scope.reducer) {
        removeReducer(id);
      }
    };
    const adaptationWork = [];
    if (scope.BUILD_ID) {
      adaptationWork.push(addStyles(id, scope.BUILD_ID));
    }
    if (scope.reducer) {
      adaptationWork.push(addReducer(id, scope.reducer));
    }
    if (scope.middleware) {
      adaptationWork.push(addMiddleware(id, scope.middleware));
    }
    if (scope.saga) {
      adaptationWork.push(addSaga(id, scope.saga));
    }
    try {
      await Promise.all(adaptationWork);
    } catch (error) {
      cleanup();
      throw error;
    }
    return {
      view: isolateProgram(id, scope),
      cleanup,
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
      const loaded = loadedModules[id];
      if (loaded) {
        delete loadedModules[id];
        loaded.cleanup();
      }
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
        obsoleteModules.push(existing);
        const loaded = loadedModules[existing];
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

  const isolateProgram = (id, scope) => {
    if (!scope.Main) {
      return null;
    }

    const preferentialStore = store.namespace(id);

    const Bridge = (props) => {
      const parentContext = useReduxContext();

      const reduxContext = React.useMemo(
        () => ({
          store: preferentialStore,
          subscription: parentContext.subscription,
        }),
        [parentContext.subscription],
      );

      const owned = React.memo(() => {
        if (props.ref) {
          return {
            ...props.owned,
            ref: props.ref,
          };
        } else {
          return props.owned;
        }
      }, [props.ref, props.owned]);

      return (
        <ReactReduxContext.Provider value={reduxContext}>
          {props.children
            ? React.createElement(scope.Main, owned, props.children)
            : React.createElement(scope.Main, owned)}
        </ReactReduxContext.Provider>
      );
    };

    class Boundaries extends React.Component {
      state = { error: null };

      static displayName = `Module(${id})`;

      static getDerivedStateFromError(error) {
        return { error };
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (this.props.isReady ^ nextProps.isReady) {
          return true;
        }
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
          return this.props.children
            ? React.createElement(Bridge, this.props, this.props.children)
            : React.createElement(Bridge, this.props);
        }
        if (scope.Error) {
          return React.createElement(scope.Error, this.state);
        }
        return null;
      }
    }

    return Boundaries;
  };

  return {
    setAvailableModules,
    loadModule,
    getLoadedModule,
  };
};

export default createModuleLoader();