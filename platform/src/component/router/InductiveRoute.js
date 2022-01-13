import React from "react";
import Route from "./Route";
import { useRouteMatch } from './hooks'

const InductiveRoute = (props) => {
  const match = useRouteMatch();
  return React.createElement(Route, {
    path: `${match.url}/${props.path}`.replace(/\/+/g, '/'),
    exact: Boolean(props.exact),
    component: props.component,
  }, null);
};

export default InductiveRoute;
