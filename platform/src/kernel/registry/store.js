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
          // TODO console.log(state) in selectors will look bad and unintuitive

          // TODO object polling might improve this
          // -> https://egghead.io/blog/object-pool-design-pattern
          stateProxy = new Proxy([], {
            get(ref, reducer) {
              if (reducer === "shared") {
                return state.shared;
              }
              const fragment = state.modules[name][reducer];
              if (!fragment) {
                warning(`module "${name}" tried to access reducer "${reducer}" that it does not own. For sharing of redux state use shared reducer and actions.`)
                return undefined;
              }
              return fragment;
            },
            has(target, reducer) {
              if (reducer === "shared") {
                return true;
              }
              return reducer in state.modules[name];
            },
            ownKeys(target) {
              const result = Reflect.ownKeys(state.modules[name]);
              result.push('shared');
              return result;
            },
            getOwnPropertyDescriptor(target, key) {
              return {
                value: this.get(target, key),
                enumerable: true,
                configurable: false,
              };
            },
            set(ref, reducer, value) {
              warning(`module "${name}" tried to mutate state of "${reducer}" reducer, intercepting.`)
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
