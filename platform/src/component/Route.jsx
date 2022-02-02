import React from "react";

import { RouterContext } from "./Router";
import { matchPath } from "../routing";

const Route = (props) => {
  if (!props.component) {
    return null;
  }

  return (
    <RouterContext.Consumer>
      {(context) => {
        const location = props.location || context.location;

        const match = props.path
          ? matchPath(
              location.pathname,
              `${context.match.url}/${props.path}`.replace(/\/+/g, "/"),
              props
            )
          : context.match;

        if (!match) {
          return null;
        }

        return (
          <RouterContext.Provider
            value={{
              ...context,
              location,
              match,
            }}
          >
            {React.createElement(props.component)}
          </RouterContext.Provider>
        );
      }}
    </RouterContext.Consumer>
  );
};

export default Route;
