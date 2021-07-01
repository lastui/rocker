import * as constants from "./constants";

export default (loader) => (store) => (next) => (action) => {
  switch (action.type) {
    case constants.SET_AVAILABLE_MODULES: {
      return loader
        .setAvailableModules(action.payload.modules)
        .then(() => next(action));
    }
    case constants.SET_ENTRYPOINT_MODULE: {
      return loader
        .loadModule(action.payload.entrypoint)
        .then(() => next(action));
    }
    case constants.SET_LANGUAGE: {
      return loader
        .loadLocales(action.payload.language)
        .then(() => next(action));
    }
    default: {
      return next(action);
    }
  }
};