import { SET_SHARED } from "../../constants";
import { warning } from "../../utils";

const BROADCAST_ACTION_PREFIX = "@@";

const nilStore = {
  dispatch() {
    warning("Redux store is not provided!");
  },
  getState() {
    warning("Redux store is not provided!");
    return {};
  },
  subscribe() {
    warning("Redux store is not provided!");
  },
  replaceReducer() {},
};

const initial = {
  underlying: nilStore,
};

const handler = {
  get(ref, prop, store) {
    if (prop !== "namespace") {
      return Reflect.get(ref.underlying, prop);
    }
    let prevState = null;
    let stateProxy = null;
    return (name) => ({
      dispatch: (action) => {
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
          type: `$${name}$${action.type}`,
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
                        warning(
                          `module "${name}" tried to access reducer "${reducer}" that it does not own.
                        For sharing of redux state use shared reducer and actions.`.replace(/  +/g, ""),
                        );
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
      replaceReducer(newReducer) {},
    });
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
