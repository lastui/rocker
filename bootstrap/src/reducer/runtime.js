import { constants } from "@lastui/rocker/platform";

const initialState = {
  entrypoint: null,
  available: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_ENTRYPOINT_MODULE: {
      return {
        entrypoint: action.payload.entrypoint,
        available: state.available,
      };
    }
    case constants.SET_AVAILABLE_MODULES: {
      const nextAvailable = {};
      for (const item of action.payload.modules) {
        nextAvailable[item.id] = true;
      }
      return {
        entrypoint: state.entrypoint,
        available: nextAvailable,
      };
    }
    default: {
      return state;
    }
  }
};