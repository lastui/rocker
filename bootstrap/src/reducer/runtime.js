import { constants } from "@lastui/rocker/platform";

const initialState = {
  initialized: false,
  entrypoint: null,
  available: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.INIT: {
      return {
        initialized: true,
        entrypoint: state.entrypoint,
        available: state.available,
      };
    }
    case constants.SET_ENTRYPOINT_MODULE: {
      return {
        initialized: state.initialized,
        entrypoint: action.payload.entrypoint,
        available: state.available,
      };
    }
    case constants.SET_AVAILABLE_MODULES: {
      const nextAvailable = {};
      for (const item of action.payload.modules) {
        if (item.hasOwnProperty("name")) {
          nextAvailable[item.name] = true;
        }
      }
      return {
        initialized: state.initialized,
        entrypoint: state.entrypoint,
        available: nextAvailable,
      };
    }
    default: {
      return state;
    }
  }
};
