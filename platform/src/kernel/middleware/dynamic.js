import { compose } from "redux";
import { warning } from "../../utils";
import { getStore } from "../registry/store";

const createDynamicMiddlewares = () => {
  let keys = [];
  let values = [];

  const injectMiddleware = async (name, middleware) => {
    const index = keys.indexOf(name);
    const instance = await middleware();
    if (!instance) {
      return false;
    }
    if (index !== -1) {
      values[index] = instance(getStore());
    } else {
      keys.push(name);
      values.push(instance(getStore()));
    }
    return true;
  };

  const ejectMiddleware = (name) => {
    const index = keys.indexOf(name);
    if (index === -1) {
      return false;
    }
    keys = keys.filter((_, idx) => idx !== index);
    values = values.filter((_, idx) => idx !== index);
    return true;
  };

  return {
    underlying: (_store) => (next) => (action) => {
      try {
        return compose.apply(null, values)(next)(action);
      } catch (error) {
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