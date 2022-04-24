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
      let prevStateIsolated = {};
      let prevState = null;
      return (id) => ({
        dispatch: ref.underlying.dispatch,
        getState: function () {
          const state = ref.underlying.getState();
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
        subscribe: ref.underlying.subscribe,
        replaceReducer: function (newReducer) {},
      });
    }
    return ref.underlying[prop];
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