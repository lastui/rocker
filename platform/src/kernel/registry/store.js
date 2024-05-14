import { SET_SHARED } from "../../constants";
import { warning } from "../../utils";

const RUNE = "$";
const BROADCAST_ACTION_PREFIX = "@@";
const IDENTITY = (type) => type;
const NIL_STATE = {};

const nilStore = {
  dispatch(_action) {},
  getState() {
    return NIL_STATE;
  },
  subscribe() {},
  replaceReducer(_newReducer) {},
};

const initial = {
  underlying: nilStore,
};

const handler = {
  get(ref, prop, store) {
    if (prop === "wrap") {
      return IDENTITY;
    }
    if (prop !== "namespace") {
      return Reflect.get(ref.underlying, prop);
    }
    let prevState = null;
    let stateProxy = null;
    return (name) => {
      const prefix = RUNE + name + RUNE;
      return {
        wrap(type) {
          if (!type || type[0] === RUNE) {
            return type;
          }
          if (type.startsWith(BROADCAST_ACTION_PREFIX)) {
            return type;
          }
          return prefix + type;
        },
        dispatch(action) {
          if (!action.type) {
            return;
          }
          if (action.type[0] === RUNE) {
            if (action.type.startsWith(prefix)) {
              return store.dispatch(action);
            }
            return;
          }
          if (action.type === SET_SHARED) {
            return store.dispatch({
              type: SET_SHARED,
              payload: {
                data: action.payload.data,
                module: name,
              },
            });
          }
          if (action.type.startsWith(BROADCAST_ACTION_PREFIX)) {
            return store.dispatch(action);
          }
          return store.dispatch({
            ...action,
            type: prefix + action.type,
          });
        },
        getState() {
          const state = store.getState();
          if (prevState !== state) {
            prevState = state;
            if (process.env.NODE_ENV === "development") {
              stateProxy = new Proxy(
                {
                  ...state.modules[name],
                  env: state.env,
                  shared: Object.freeze(state.shared),
                },
                {
                  get(ref, reducer) {
                    switch (reducer) {
                      case Symbol.iterator: {
                        return Reflect.get(ref, reducer);
                      }
                      case "toString":
                      case Symbol.toStringTag: {
                        return () => "[object Object]";
                      }
                      case "valueOf": {
                        return () => ref;
                      }
                      default: {
                        const fragment = ref[reducer];
                        if (!fragment) {
                          warning(`module "${name}" tried to access reducer "${reducer}" that it does not own.`);
                          return undefined;
                        }
                        return fragment;
                      }
                    }
                  },
                  has(ref, reducer) {
                    return reducer in ref;
                  },
                  ownKeys(ref) {
                    return Reflect.ownKeys(ref);
                  },
                  getOwnPropertyDescriptor(ref, key) {
                    return {
                      value: this.get(ref, key),
                      enumerable: true,
                      configurable: true,
                    };
                  },
                  set(ref, reducer, value) {
                    ref[reducer] = value;
                    return true;
                  },
                },
              );
            } else {
              stateProxy = {
                ...state.modules[name],
                env: state.env,
                shared: Object.freeze(state.shared),
              };
            }
          }
          return stateProxy;
        },
        subscribe: store.subscribe,
        replaceReducer(_newReducer) {},
      };
    };
  },
  set(ref, prop, value) {
    if (prop === "underlying" && value) {
      ref.underlying = value;
      return true;
    }
    return false;
  },
};

const store = new Proxy(initial, handler);

function setStore(nextStore) {
  if (nextStore) {
    store.underlying = nextStore;
  } else {
    store.underlying = nilStore;
  }
}

function getStore() {
  return store;
}

export { getStore, setStore };
