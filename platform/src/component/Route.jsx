import React from "react";

import { RouterContext } from "./Router";
import { matchPath } from "../routing";

const Branch = (props) => {
  const match = React.useMemo(
    () =>
      matchPath(
        props.context.location.pathname,
        `${props.context.match.url}/${props.path}`.replace(/\/+/g, "/"),
        props.exact
      ),
    [
      props.path,
      props.exact,
      props.context.location.pathname,
      props.context.match.url,
    ]
  );

  const composite = React.useMemo(() => {
    if (match) {
      return {
        ...props.context,
        match,
      };
    } else {
      return props.context;
    }
  }, [props.context, match]);

  if (!match) {
    return null;
  }

  return (
    <RouterContext.Provider value={composite}>
      {React.createElement(props.component)}
    </RouterContext.Provider>
  );
};

const Route = (props) => {
  if (!props.component || !props.path) {
    return null;
  }

  return (
    <RouterContext.Consumer>
      {(context) => (
        <Branch
          path={props.path}
          exact={props.exact}
          context={context}
          component={props.component}
        />
      )}
    </RouterContext.Consumer>
  );
};

export default Route;
