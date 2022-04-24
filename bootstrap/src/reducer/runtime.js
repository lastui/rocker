import { constants } from "@lastui/rocker/platform";

const initialState = {
  entrypoint: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_ENTRYPOINT_MODULE: {
      return {
        entrypoint: action.payload.entrypoint,
      };
    }
    default: {
      return state;
    }
  }
};
