import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { combineReducers } from "redux";
import { history } from "./routing";

// FIXME make shared work in development
function configureStore(initialState = {}, rootReducer = {}) {
  const enhancers = [routerMiddleware(history)];

  const reducer = combineReducers({
    ...rootReducer,
    router: connectRouter(history),
  });

  const store = createStore(
    reducer,
    initialState,
    compose(...[applyMiddleware(...enhancers)])
  );

  return store;
}

export function registerModule(scope) {
  const node = document.createElement("div");
  const store = configureStore({}, scope.reducer);
  const View = scope.MainView;

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <View />
        </Switch>
      </ConnectedRouter>
    </Provider>,
    node
  );

  document.body.appendChild(node);
}

export const Module = (props) => (
  <div
    style={{
      boxSizing: "border-box",
      border: "1px dashed rgba(0,0,0,.5)",
      height: "100%",
      width: "100%",
    }}
  >
    {`[${props.name}]`}
  </div>
);
