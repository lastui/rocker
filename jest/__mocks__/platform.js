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
  Route: () => null,
  Router: (props) => (props.children ? React.createElement(React.Fragment, {}, props.children) : null),
  Redirect: () => null,
  Link: (props) => (props.component ? React.createElement(props.component, { navigate: () => {} }) : null),
  useHistory: () => ({
    push: () => {},
    replace: () => {},
  }),
  useLocation: () => null,
  useParams: () => null,
  useRouteMatch: () => null,
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
  },
  createDynamicMiddleware: () => (_store) => (next) => (action) => next(action),
  createLoaderMiddleware: () => (_store) => (next) => (action) => next(action),
  createSagaMiddleware: (options) => {
    if (options && options.context && options.context.fetchContext) {
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
  getStore: () => store,
  sharedReducer: (state = {}, action) => state,
  modulesReducer: (state = {}, action) => state,
};