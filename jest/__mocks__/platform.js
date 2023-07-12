const React = require("react");
const ReduxSaga = require("redux-saga");

const constants = new Proxy(Object, {
  get(_ref, prop) {
    return prop;
  },
});

let store = null;

module.exports = {
  Module: (props) =>
    props.children
      ? React.createElement("section", { "data-testid": `module/${props.name}` }, props.children)
      : React.createElement("section", { "data-testid": `module/${props.name}` }),
  constants,
  actions: {
    setLanguage: (language) => ({
      type: constants.SET_LANGUAGE,
      payload: {
        language,
      },
    }),
    refresh: () => ({
      type: constants.REFRESH,
    }),
    setGlobalShared: (data) => ({
      type: constants.SET_SHARED,
      payload: {
        data,
        module: false,
      },
    }),
    setLocalShared: (data) => ({
      type: constants.SET_SHARED,
      payload: {
        data,
        module: true,
      },
    }),
  },
  createDynamicMiddleware: () => (_store) => (next) => (action) => next(action),
  createLoaderMiddleware: () => (_store) => (next) => (action) => next(action),
  createSagaMiddleware: (options) => {
    if (options?.context?.fetchContext) {
      options.context.fetchContext();
    }
    const channel = ReduxSaga.stdChannel();
    return {
      sagaMiddleware: (_store) => (next) => (action) => next(action),
      runSaga: (preferentialStore, saga) =>
        ReduxSaga.runSaga(
          {
            context: options.context,
            channel,
            dispatch: preferentialStore.dispatch,
            getState: preferentialStore.getState,
          },
          saga,
        ),
    };
  },
  setStore: (nextStore) => {
    store = nextStore;
  },
  manualCleanup: () => {},
  getStore: () => store,
  sharedReducer: (state = {}, action) => state,
  modulesReducer: (state = {}, action) => state,
};
