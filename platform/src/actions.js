import * as constants from "./constants";

export const init = (fetchContext, initializeRuntime) => ({
  type: constants.INIT,
  payload: {
    fetchContext,
    initializeRuntime,
  }
});

export const setLanguage = (language) => ({
  type: constants.SET_LANGUAGE,
  payload: {
    language,
  },
});

export const addI18nMessages = (data = {}) => ({
  type: constants.ADD_I18N_MESSAGES,
  payload: {
    data,
  },
});

export const removeI18nMessages = (data) => ({
  type: constants.REMOVE_I18N_MESSAGES,
  payload: {
    data,
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
