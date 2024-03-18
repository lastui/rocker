import * as constants from "../../constants";

export const initialState = {};

function createSharedReducer() {
  const sharedMapping = {};
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.CLEAR_SHARED: {
        return {
          ...initialState,
        };
      }
      case constants.SET_SHARED: {
        const nextState = {
          ...state,
          ...action.payload.data,
        };
        for (const key in nextState) {
          if (nextState[key] === undefined) {
            delete nextState[key];
          }
        }
        return nextState;
      }
      default: {
        return state;
      }
    }
  };
}

export default createSharedReducer();
