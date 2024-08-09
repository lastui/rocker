import * as constants from "../../constants";
import { warning } from "../../utils";
import loader from "../registry/loader";

const createLoaderMiddleware = () => (_store) => (next) => (action) => {
  try {
    switch (action.type) {
      case constants.SET_AVAILABLE_MODULES: {
        return loader.setAvailableModules(action.payload.modules).then(() => next(action));
      }

      case constants.SET_ENTRYPOINT_MODULE: {
        return loader.loadModule(action.payload.entrypoint, new AbortController()).then(() => next(action));
      }

      default: {
        return next(action);
      }
    }
  } catch (error) {
    warning("loader middleware errored", error);
    return next(action);
  }
};

export default createLoaderMiddleware;
