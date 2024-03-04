import { SET_SHARED } from "../../constants";
import { warning } from "../../utils";

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
  replaceReducer() {
    warning("Redux store is not provided!");
  },
};

const initial = {
  underlying: nilStore,
};

const handler = {
  get(ref, prop, proxy) {
    if (prop !== "namespace") {
      return Reflect.get(ref.underlying, prop);
    }
    let prevProxy = null;
    let prevState = null;
    return (name) => ({
      dispatch: (action) => {
        if (action.type === SET_SHARED) {
          return proxy.dispatch({
            type: SET_SHARED,
            payload: {
              data: action.payload.data,
              module: action.payload.module ? name : undefined,
            },
          });
        }
        return proxy.dispatch(action);
      },
      getState() {
        const state = proxy.getState();
        if (prevState !== state) {
          prevState = state;
          // TODO object polling might improve this
          // -> https://egghead.io/blog/object-pool-design-pattern
          prevProxy = new Proxy(null, {
            get(ref, reducer) {
              if (reducer === "shared") {
                return state.shared;
              }
              if (!state.modules[name][reducer]) {
                // TODO add warning about reaching into other reducer state without using shared data pattern
                return null;
              }
              return state.modules[name][reducer];
            },
            set(ref, reducer, value) {
              // TODO add warning of mutating state 
            }
          });
        }
        return prevProxy;
      },
      subscribe: proxy.subscribe,
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
