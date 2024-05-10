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
  deleteProperty(ref, prop) {
    const index = ref.keys.indexOf(prop);
    if (index === -1) {
      return true;
    }
    ref.keys = ref.keys.filter((_, idx) => idx !== index);
    ref.values = ref.values.filter((_, idx) => idx !== index);
    return true;
  },
  get(ref, prop) {
    if (prop === Symbol.iterator) {
      return ref.values[Symbol.iterator].bind(ref.values);
    }
    const index = ref.keys.indexOf(prop);
    if (index !== -1) {
      return ref.values[index][2];
    }
    return undefined;
  },
  set(ref, prop, value) {
    if (!value || prop === Symbol.iterator) {
      return false;
    }
    const index = ref.keys.indexOf(prop);
    if (index === -1) {
      ref.keys.push(prop);
      ref.values.push([prop, `${RUNE}${prop}${RUNE}`, value]);
    } else {
      ref.values[index] = [prop, `${RUNE}${prop}${RUNE}`, value];
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
