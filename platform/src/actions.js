import * as constants from "./constants";

export const init = () => ({
  type: constants.INIT,
});

export const replaceShared = (payload) => ({
  type: constants.REPLACE_SHARED,
  payload,
});

export const setModuleShared = (name, data = {}) => ({
  type: constants.SET_MODULE_SHARED,
  payload: {
    name,
    data,
  },
});

export const setAvailableModules = (modules = []) => ({
  type: constants.SET_AVAILABLE_MODULES,
  payload: {
    modules,
  },
});

export const setEntryPointModule = (entrypoint) => ({
  type: constants.SET_ENTRYPOINT_MODULE,
  payload: {
    entrypoint,
  },
});

export const loadModule = (name) => ({
  type: constants.LOAD_MODULE,
  payload: {
    name,
  },
});
