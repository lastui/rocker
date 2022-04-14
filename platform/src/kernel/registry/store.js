import { warning } from "../../utils";

const initial = {
  underlying: {
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
  },
};

const handler = {
  get: function (ref, prop) {
    if (prop === "namespace") {
      const proxy = arguments[arguments.length - 1];
      return (id) => ({
        dispatch: proxy.dispatch,
        getState: function () {
          const state = proxy.getState();
          const isolatedState = {};
          for (const mid in state.modules) {
            if (mid === id) {
              continue;
            }
            const bucket = state.modules[mid];
            for (const prop in bucket) {
              isolatedState[prop] = bucket[prop];
            }
          }
          const bucket = state.modules[id];
          if (bucket) {
            for (const prop in bucket) {
              isolatedState[prop] = bucket[prop];
            }
          }
          isolatedState.shared = state.shared;
          return isolatedState;
        },
        subscribe: proxy.subscribe,
        replaceReducer: function (newReducer) {},
      });
    }
    return Reflect.get(ref.underlying, prop);
  },
  set: function (ref, prop, value) {
    if (prop === "underlying" && value) {
      ref.underlying = value;
      return true;
    }
    return false;
  },
};

const store = new Proxy(initial, handler);

function setStore(nextStore) {
  store.underlying = nextStore;
}

function getStore() {
  return store;
}

export { getStore, setStore };
