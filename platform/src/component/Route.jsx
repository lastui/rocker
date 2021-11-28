import React from "react";
import { Routes, Route as ReactRoute, useLocation } from "react-router";

const Route = (props) => {
  const location = useLocation();

  return (
    <Routes>
      {React.createElement(ReactRoute, {
        path: `${location.pathname}/${props.path}`.replace(/\/+/g, '/'),
        exact: Boolean(props.exact),
        component: props.component,
      }, null)}
    </Routes>
  );
};

export default Route;
