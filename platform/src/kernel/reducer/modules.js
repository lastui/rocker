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
  deleteProperty(ref, key) {
    let index = ref.keys.indexOf(key);
    if (index === -1) {
      return true;
    }
    const stop = ref.keys.length - 1;
    let point = index;
    while (index < stop) {
      ++point;
      ref.keys[index] = ref.keys[point];
      ref.values[index] = ref.values[point];
      index = point;
    }
    ref.keys.pop();
    ref.values.pop();
    return true;
  },
  get(ref, key) {
    if (key === Symbol.iterator) {
      return ref.values[Symbol.iterator].bind(ref.values);
    }
    const index = ref.keys.indexOf(key);
    if (index !== -1) {
      return ref.values[index][2];
    }
    return undefined;
  },
  set(ref, key, reducer) {
    if (!reducer || typeof key === "symbol") {
      return false;
    }
    const index = ref.keys.indexOf(key);
    if (index === -1) {
      ref.keys.push(key);
      ref.values.push([key, RUNE + key + RUNE, reducer]);
    } else {
      ref.values[index][2] = reducer;
    }
    return true;
  },
};

const modulesReducers = new Proxy(initial, handler);

const initialState = {};

function createModulesReducer() {
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.INIT:
      case constants.REFRESH:
      case constants.FETCH_CONTEXT:
      case constants.MODULE_LOADED:
      case constants.SET_AVAILABLE_MODULES: {
        return state;
      }
      case constants.MODULE_INIT: {
        const name = action.payload.module;
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
        console.info(`+ module ${name}`);
        return state;
      }
      case constants.MODULE_UNLOADED: {
        const name = action.payload.module;
        console.info(`- module ${name}`);
        if (name in state) {
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

export { modulesReducers, initialState };

export default createModulesReducer();
