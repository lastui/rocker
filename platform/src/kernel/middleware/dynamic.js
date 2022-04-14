import { compose } from "redux";
import { warning } from "../../utils";
import { getStore } from "../registry/store";

const createDynamicMiddlewares = () => {
  let members = [];
  let applied = [];

  const injectMiddleware = async (id, middleware) => {
    const index = members.indexOf(id);
    if (index !== -1) {
      return false;
    }
    const instance = await middleware();
    if (!instance) {
      return false;
    }
    members.push(id);
    applied.push(instance(getStore()));
    return true;
  };

  const ejectMiddleware = (id) => {
    const index = members.indexOf(id);
    if (index === -1) {
      return false;
    }
    members = members.filter((_, idx) => idx !== index);
    applied = applied.filter((_, idx) => idx !== index);
    return true;
  };

  return {
    underlying: (_store) => (next) => (action) => {
      try {
        return compose.apply(null, applied)(next)(action);
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

export default dynamicMiddlewaresInstance.underlying;
