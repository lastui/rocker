import { compose } from "redux";

import { warning } from "../../utils";
import { getStore } from "../registry/store";

const createDynamicMiddlewares = () => {
  let keys = [];
  let values = [];
  let composition = compose();

  const injectMiddleware = async (name, middleware) => {
    const index = keys.indexOf(name);
    const instance = await middleware();
    // v8 ignore next 3
    if (!instance) {
      return false;
    }
    if (index !== -1) {
      values[index] = instance(getStore());
    } else {
      keys.push(name);
      values.push(instance(getStore()));
    }
    composition = compose.apply(null, values);
    return true;
  };

  const ejectMiddleware = (name) => {
    const index = keys.indexOf(name);
    if (index === -1) {
      return false;
    }
    keys = keys.filter((_, idx) => idx !== index);
    values = values.filter((_, idx) => idx !== index);
    composition = compose.apply(null, values);
    return true;
  };

  return {
    underlying: (_store) => (next) => (action) => {
      try {
        return composition(next)(action);
      } catch (error) {
        // TODO try to do "module {name} dynamic middleware errored"
        warning("dynamic middleware errored", error);
        return next(action);
      }
    },
    injectMiddleware,
    ejectMiddleware,
  };
};

const dynamicMiddlewaresInstance = createDynamicMiddlewares();

export const { injectMiddleware, ejectMiddleware } = dynamicMiddlewaresInstance;

export default () => dynamicMiddlewaresInstance.underlying;
