import * as constants from "../../constants";
import { warning } from "../../utils";
import Scoped from "../component/Scoped";
import { downloadProgram } from "./assets";
import { addStyles, removeStyles } from "./css";
import { addMiddleware, removeMiddleware } from "./middleware";
import { addReducer, removeReducer } from "./reducer";
import { addSaga, removeSaga, setSagaRunner } from "./saga";
import { setStore, getStore } from "./store";

export const adaptModule = async (name, scope) => {
  const preferentialStore = scope.saga || scope.component ? getStore().namespace(name) : null;
  const cleanup = () => {
    if (scope.BUILD_ID) {
      removeStyles(name);
    }
    if (scope.saga) {
      removeSaga(name, preferentialStore);
    }
    if (scope.middleware) {
      removeMiddleware(name);
    }
    if (scope.reducers) {
      removeReducer(name);
    }
  };
  const adaptationWork = [];
  if (scope.BUILD_ID) {
    adaptationWork.push(addStyles(name, scope.BUILD_ID));
  }
  if (scope.reducers) {
    adaptationWork.push(addReducer(name, scope.reducers));
  }
  if (scope.middleware) {
    adaptationWork.push(addMiddleware(name, scope.middleware));
  }
  if (scope.saga) {
    adaptationWork.push(addSaga(name, preferentialStore, scope.saga));
  }
  try {
    await Promise.all(adaptationWork);
  } catch (error) {
    cleanup();
    throw error;
  }
  return {
    view: Scoped(name, preferentialStore, scope),
    cleanup,
  };
};

const createModuleLoader = () => {
  const availableModules = {};
  const loadedModules = {};
  const loadingModules = {};

  const getLoadedModule = (name) => loadedModules[name];

  const loadModule = (name, controller) => {
    if (!name) {
      return Promise.resolve(false);
    }
    const available = availableModules[name];
    const loaded = loadedModules[name];
    if (!available || !available.program) {
      return Promise.resolve(Boolean(loaded));
    }
    if (loaded) {
      return Promise.resolve(false);
    }
    const loading = loadingModules[name];
    if (loading) {
      return loading;
    }
    function promiseRefDrop() {
      delete loadingModules[name];
      controller.signal.removeEventListener("abort", promiseRefDrop);
    }
    controller.signal.addEventListener("abort", promiseRefDrop);
    const promise = downloadProgram(name, available.program, controller)
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
        return adaptModule(name, scope);
      })
      .then((data) => {
        if (!availableModules[name]) {
          data.cleanup();
          return true;
        }
        loadedModules[name] = data;
        getStore().dispatch({
          type: constants.MODULE_LOADED,
          payload: {
            module: name,
          },
        });
        return true;
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          warning(`module ${name} failed to load`, error);
        }
        return Promise.resolve(false);
      })
      .then((changed) => {
        promiseRefDrop();
        return changed;
      });
    loadingModules[name] = promise;
    return promise;
  };

  const unloadModule = (name, loaded) =>
    new Promise((resolve) => {
      delete loadedModules[name];
      loaded.cleanup();
      getStore().dispatch({
        type: constants.MODULE_UNLOADED,
        payload: {
          module: name,
        },
      });
      return resolve(true);
    });

  const setAvailableModules = async (modules) => {
    const scheduledUnload = [];
    const newModules = {};
    for (let i = modules.length; i--; ) {
      const item = modules[i];
      newModules[item.name] = item;
      if (!availableModules[item.name]) {
        availableModules[item.name] = item;
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

  const isAvailable = (name) => Boolean(availableModules[name]);

  const manualCleanup = () => {
    for (const name in availableModules) {
      delete availableModules[name];
    }
    for (const name in loadedModules) {
      loadedModules[name].cleanup();
      delete loadedModules[name];
    }
    setSagaRunner(null);
    setStore(null);
  };

  return {
    setAvailableModules,
    isAvailable,
    loadModule,
    getLoadedModule,
    manualCleanup,
  };
};

const instance = createModuleLoader();

export const manualCleanup = instance.manualCleanup;

export default instance;
