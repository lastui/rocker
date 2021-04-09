import * as constants from "./constants";

export const init = (fetchContext) => ({
  type: constants.INIT,
  payload: {
    fetchContext,
  }
});

export const setLanguage = (language) => ({
  type: constants.SET_LANGUAGE,
  payload: {
    language,
  },
});

export const addShared = (name, data = {}) => ({
  type: constants.ADD_SHARED,
  payload: {
    name,
    data,
  },
});

export const removeShared = (name) => ({
  type: constants.REMOVE_SHARED,
  payload: {
    name,
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
