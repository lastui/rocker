import * as constants from "../../constants";

const initialState = {
  readyModules: {},
  lastUpdate: 0,
};

function createEnvReducer() {
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.SET_ENTRYPOINT_MODULE: {
        return {
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_READY: {
        const nextReadyModules = { ...state.readyModules };
        nextReadyModules[action.payload.module] = true;
        return {
          lastUpdate: state.lastUpdate,
          readyModules: nextReadyModules,
        };
      }
      case constants.MODULE_LOADED: {
        return {
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: state.readyModules,
        };
      }
      case constants.MODULE_UNLOADED: {
        const nextReadyModules = { ...state.readyModules };
        delete nextReadyModules[action.payload.module];
        return {
          lastUpdate: (state.lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
          readyModules: nextReadyModules,
        };
      }
      default: {
        return state;
      }
    }
  };
};

export { initialState };

export default createEnvReducer();
