import React from "react";

import { RouterContext } from "./Router";
import { matchPath } from "../routing";

const Route = (props) => (
  <RouterContext.Consumer>
    {(context) => {
      const location = props.location || context.location;

      const ownedMatch = props.computedMatch
        ? matchPath(location.pathname, props.computedMatch.path, props.computedMatch)
        : (
          props.path
            ? matchPath(location.pathname, `${context.match.url}/${props.path}`.replace(/\/+/g, '/'), props)
            : context.match
        )

      const ownedProps = { ...context, location, match: ownedMatch };

      return (
        <RouterContext.Provider value={ownedProps}>
          {ownedProps.match
            ? props.component
              ? React.createElement(props.component, ownedProps)
              : null
            : null
          }
        </RouterContext.Provider>
      );
    }}
  </RouterContext.Consumer>
);

export default Route;
