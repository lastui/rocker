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
        const match = React.useMemo(
          () => {
            if (!props.path) {
              return null
            }
            return matchPath(
              context.location.pathname,
              `${context.match.url}/${props.path}`.replace(/\/+/g, "/"),
              props.exact
            )
          },
          [props.path, props.exact, context.location.pathname, context.match.url]
        );

        const composite = React.useMemo(
          () => {
            if (match) {
              return {
                ...context,
                match,
              }
            } else {
              return context
            }
          },
          [context, match]
        );

        if (!match) {
          return null;
        }

        return (
          <RouterContext.Provider value={composite}>
            {React.createElement(props.component)}
          </RouterContext.Provider>
        );
      }}
    </RouterContext.Consumer>
  );
};

export default Route;
