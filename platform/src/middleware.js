import { compose } from "redux";

import * as constants from "./constants";

export const moduleLoaderMiddleware =
  (loader) => (store) => (next) => (action) => {
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

const createDynamicMiddlewares = () => {
  let members = [];
  let applied = [];
  let storeRef;

  const injectMiddleware = (id, middleware) => {
    const index = members.findIndex((item) => item === id);
    if (index !== -1) {
      return false;
    }
    const instance = await middleware();
    if (!instance) {
      return false;
    }
    members.push(id);
    applied.push(instance(storeRef));
    return true;
  };

  const ejectMiddleware = (id) => {
    const index = members.findIndex((item) => item === id);
    if (index === -1) {
      return false;
    }
    members = members.filter((_, idx) => idx !== index);
    applied = applied.filter((_, idx) => idx !== index);
    return true;
  };

  return {
    scope: (store) => {
      storeRef = store;
      return (next) => (action) => compose(...applied)(next)(action);
    },
    injectMiddleware,
    ejectMiddleware,
  };
};

const dynamicMiddlewaresInstance = createDynamicMiddlewares();

export const dynamicMiddleware = dynamicMiddlewaresInstance.scope;

export const { injectMiddleware, ejectMiddleware } = dynamicMiddlewaresInstance;
