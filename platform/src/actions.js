import * as constants from "./constants";

export const init = (fetchContext, initializeRuntime) => ({
  type: constants.INIT,
  payload: {
    fetchContext,
    initializeRuntime,
  },
});

export const setLanguage = (language) => ({
  type: constants.SET_LANGUAGE,
  payload: {
    language,
  },
});

export const addI18nMessages = (module, language, data = {}) => ({
  type: constants.ADD_I18N_MESSAGES,
  payload: {
    module,
    language,
    data,
  },
});

export const removeI18nMessages = (module) => ({
  type: constants.REMOVE_I18N_MESSAGES,
  payload: {
    module,
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

export const loadModule = (id) => ({
  type: constants.LOAD_MODULE,
  payload: {
    id,
  },
});