import * as constants from "../../constants";
import { warning } from "../../utils";

const RUNE = "$";
const BROADCAST_ACTION_PREFIX = "@@";

const PROBE_ACTION = {
  type: undefined,
};

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
      return target.values[index][2];
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
      obj.values.push([prop, `${RUNE}${prop}${RUNE}`, value]);
    } else {
      obj.values[index] = [prop, `${RUNE}${prop}${RUNE}`, value];
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
        const reducer = modulesReducers[name];
        if (!reducer) {
          return state;
        }
        try {
          return {
            ...state,
            [name]: reducer(state[name], action),
          };
        } catch (error) {
          warning(`module ${name} reducer failed to reduce on action ${action.type}`, error);
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
        let changed = name in state;
        if (changed) {
          console.debug(`module ${name} evicting redux state`);
        }
        console.debug(`module ${name} unloaded`);
        console.info(`- module ${name}`);
        if (changed) {
          const nextState = { ...state };
          delete nextState[name];
          return nextState;
        }
        return state;
      }
      default: {
        let nextState = null;
        for (const [name, prefix, reducer] of modulesReducers) {
          let copy = undefined;

          if (action.type.startsWith(BROADCAST_ACTION_PREFIX)) {
            copy = action;
          } else if (action.type.startsWith(prefix)) {
            copy = {
              ...action,
              type: action.type.slice(prefix.length),
            };
          } else {
            copy = PROBE_ACTION;
          }

          try {
            const fragment = reducer(state[name], copy);
            if (state[name] !== fragment) {
              if (!nextState) {
                nextState = { ...state };
              }
              nextState[name] = fragment;
            }
          } catch (error) {
            warning(`module ${name} reducer failed to reduce`, error);
          }
        }
        if (nextState) {
          return nextState;
        }
        return state;
      }
    }
  };
}

export { modulesReducers };

export default createModulesReducer();
