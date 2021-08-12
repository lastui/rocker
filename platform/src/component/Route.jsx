import React from "react";
import { Route as ReactRoute, useRouteMatch } from "react-router";

const Route = (props) => {
  const match = useRouteMatch();
  return React.createElement(ReactRoute, {
    path: `${match.url}/${props.path}`.replace(/\/+/g, '/'),
    exact: Boolean(props.exact),
    component: props.component,
  }, null);
};

export default Route;
