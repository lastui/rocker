import { compose } from "redux";
import { warning } from '../../utils';

const createDynamicMiddlewares = () => {
  let members = [];
  let applied = [];
  let storeRef;

  const injectMiddleware = async (id, middleware) => {
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
      return (next) => (action) => {
        try {
          return compose(...applied)(next)(action)
        } catch (error) {
          warning('dynamic middleware errored', error);
          return next(action);
        }
      };
    },
    injectMiddleware,
    ejectMiddleware,
  };
};

const dynamicMiddlewaresInstance = createDynamicMiddlewares();

const dynamicMiddleware = dynamicMiddlewaresInstance.scope;

export const { injectMiddleware, ejectMiddleware } = dynamicMiddlewaresInstance;

export default dynamicMiddleware;