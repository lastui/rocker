import * as constants from "../../constants";
import { warning } from "../../utils";
import Scoped from "../component/Scoped";
import { downloadProgram } from "./assets";
import { addStyles, removeStyles } from "./css";
import { addMiddleware, removeMiddleware } from "./middleware";
import { addReducer, removeReducer } from "./reducer";
import { addSaga, removeSaga } from "./saga";
import { getStore } from "./store";

export const adaptModule = async (id, scope) => {
  const preferentialStore = scope.saga || scope.component ? getStore().namespace(id) : null;
  const cleanup = () => {
    if (scope.BUILD_ID) {
      removeStyles(id);
    }
    if (scope.saga) {
      removeSaga(id, preferentialStore);
    }
    if (scope.middleware) {
      removeMiddleware(id);
    }
    if (scope.reducers) {
      removeReducer(id);
    }
  };
  const adaptationWork = [];
  if (scope.BUILD_ID) {
    adaptationWork.push(addStyles(id, scope.BUILD_ID));
  }
  if (scope.reducers) {
    adaptationWork.push(addReducer(id, scope.reducers));
  }
  if (scope.middleware) {
    adaptationWork.push(addMiddleware(id, scope.middleware));
  }
  if (scope.saga) {
    adaptationWork.push(addSaga(id, preferentialStore, scope.saga));
  }
  try {
    await Promise.all(adaptationWork);
  } catch (error) {
    cleanup();
    throw error;
  }
  return {
    view: Scoped(id, preferentialStore, scope),
    cleanup,
  };
};

const createModuleLoader = () => {
  const availableModules = {};
  const loadedModules = {};
  const loadingModules = {};

  const getLoadedModule = (id) => loadedModules[id];

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
      .then((data) => {
        const scope = data;
        if (available.props && scope.props) {
          scope.props = {
            ...scope.props,
            ...available.props,
          };
        } else if (available.props) {
          scope.props = { ...available.props };
        }
        return adaptModule(id, scope);
      })
      .then((data) => {
        if (!availableModules[id]) {
          data.cleanup();
          return true;
        }
        loadedModules[id] = data;
        getStore().dispatch({
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

  const unloadModule = (id, loaded) =>
    new Promise((resolve) => {
      delete loadedModules[id];
      loaded.cleanup();
      getStore().dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          module: id,
        },
      });
      return resolve(true);
    });

  const setAvailableModules = async (modules) => {
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
          scheduledUnload.push(unloadModule(existing, loaded));
        }
      }
    }
    for (let i = obsoleteModules.length; i--; ) {
      delete availableModules[obsoleteModules[i]];
    }
    await Promise.allSettled(scheduledUnload);
  };

  const isAvailable = (id) => Boolean(availableModules);

  return {
    setAvailableModules,
    isAvailable,
    loadModule,
    getLoadedModule,
  };
};

export default createModuleLoader();