import * as constants from "../../constants";
import { warning } from "../../utils";

const initial = {
  keys: [],
  values: [],
};

const handler = {
  deleteProperty(target, prop) {
    const index = target.keys.indexOf(prop);
    if (index === -1) {
      return true;
    }
    target.keys = target.keys.filter((_, idx) => idx !== index);
    target.values = target.values.filter((_, idx) => idx !== index);
    return true;
  },
  get(target, prop) {
    if (prop === Symbol.iterator) {
      return target.values[Symbol.iterator].bind(target.values);
    }
    const index = target.keys.indexOf(prop);
    if (index !== -1) {
      return target.values[index][1];
    }
    return undefined;
  },
  set(obj, prop, value) {
    if (!value) {
      return false;
    }
    const index = obj.keys.indexOf(prop);
    if (index === -1) {
      obj.keys.push(prop);
      obj.values.push([prop, value]);
    } else {
      obj.values[index] = [prop, value];
    }
    return true;
  },
};

const modulesReducers = new Proxy(initial, handler);

export const initialState = {};

function createModulesReducer() {
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.INIT:
      case constants.REFRESH:
      case constants.FETCH_CONTEXT:
      case constants.I18N_MESSAGES_BATCH:
      case constants.MODULE_LOADED:
      case constants.SET_AVAILABLE_MODULES: {
        return state;
      }
      case constants.MODULE_INIT: {
        const name = action.payload.module;
        console.debug(`module ${name} initialized`);
        let changed = false;
        const reducer = modulesReducers[name];
        if (reducer) {
          try {
            state[name] = reducer(state[name], action);
            changed = true;
          } catch (error) {
            warning(`module ${name} reducer failed to reduce`, error);
          }
        }
        if (changed) {
          return { ...state };
        }
        return state;
      }
      case constants.MODULE_READY: {
        const name = action.payload.module;
        console.debug(`module ${name} ready`);
        console.info(`+ module ${name}`);
        return state;
      }
      case constants.MODULE_UNLOADED: {
        const name = action.payload.module;
        let changed = false;
        if (state[name]) {
          console.debug(`module ${name} evicting redux state`);
          delete state[name];
          changed = true;
        }
        console.debug(`module ${name} unloaded`);
        console.info(`- module ${name}`);
        if (changed) {
          return { ...state };
        }
        return state;
      }
      default: {
        let changed = false;
        for (const [name, reducer] of modulesReducers) {
          try {
            const nextState = reducer(state[name], action);
            if (state[name] !== nextState) {
              state[name] = nextState;
              changed = true;
            }
          } catch (error) {
            warning(`module ${name} reducer failed to reduce`, error);
          }
        }
        if (changed) {
          return { ...state };
        }
        return state;
      }
    }
  };
}

export { modulesReducers };

export default createModulesReducer();