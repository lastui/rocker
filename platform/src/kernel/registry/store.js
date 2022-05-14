import { SET_SHARED } from "../../constants";
import { warning } from "../../utils";

const defaultStore = {
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
  underlying: defaultStore,
};

const handler = {
  get(ref, prop) {
    if (prop === "namespace") {
      const proxy = arguments[arguments.length - 1];
      let prevStateIsolated = {};
      let prevState = null;
      return (id) => ({
        dispatch: (action) => {
          if (action.type === SET_SHARED) {
            return proxy.dispatch({
              type: SET_SHARED,
              payload: {
                data: action.payload.data,
                module: action.payload.module ? id : undefined,
              },
            });
          } else {
            return proxy.dispatch(action);
          }
        },
        getState() {
          const state = proxy.getState();
          if (prevState === state) {
            return prevStateIsolated;
          }
          prevState = state;
          prevStateIsolated = {};
          for (const mid in state.modules) {
            if (mid === id) {
              continue;
            }
            prevStateIsolated = Object.assign(prevStateIsolated, state.modules[mid]);
          }
          const itself = state.modules[id];
          if (itself) {
            prevStateIsolated = Object.assign(prevStateIsolated, itself);
          }
          prevStateIsolated.shared = state.shared;
          return prevStateIsolated;
        },
        subscribe: proxy.subscribe,
        replaceReducer(newReducer) {},
      });
    }
    return Reflect.get(ref.underlying, prop);
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
    store.underlying = defaultStore;
  }
}

function getStore() {
  return store;
}

export { getStore, setStore };