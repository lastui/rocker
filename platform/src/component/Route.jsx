import React from "react";
import { Route as ReactRoute } from "react-router";
import { useRouteMatch } from "react-router-dom";

const Route = () => {
  const match = useRouteMatch();
  return React.createElement(ReactRoute, {
    path: `${match.url}/${props.path}`,
    exact: Boolean(props.exact),
    component: props.component,
  }, null);
};

export default Route;
