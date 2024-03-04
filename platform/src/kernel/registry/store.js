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
              module: action.payload.module ? name : undefined,
            },
          });
        }
        return store.dispatch(action);
      },
      getState() {
        const state = store.getState();
        if (prevState !== state) {
          prevState = state;
          // TODO object polling might improve this
          // -> https://egghead.io/blog/object-pool-design-pattern
          stateProxy = new Proxy(null, {
            get(ref, reducer) {
              if (reducer === "shared") {
                return state.shared;
              }
              const fragment = state.modules[name][reducer];
              if (!fragment) {
                // TODO add warning about reaching into other module state without using shared data pattern
                return undefined;
              }
              return fragment;
            },
            set(ref, reducer, value) {
              // TODO add warning of mutating state 
            }
          });
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
