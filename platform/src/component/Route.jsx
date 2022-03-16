import { useMemo, createElement } from "react";

import { RouterContext } from "./Router";
import { matchPath } from "../routing";

const Branch = (props) => {
  const match = useMemo(() => {
    const fullPath = `${props.context.match.url}/${props.path}`.replace(/\/+/g, "/")
    const nextMatch = matchPath(props.context.location.pathname, fullPath, props.exact);
    if (!nextMatch) {
      return nextMatch;
    }
    return {
      ...nextMatch,
      parent: fullPath,
    };
  }, [
    props.path,
    props.exact,
    props.context.location.pathname,
    props.context.match.url,
  ]);

  const composite = useMemo(() => {
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
      {createElement(props.component)}
    </RouterContext.Provider>
  );
};

const Route = (props) => {
  if (!props.component || !(props.index || props.path)) {
    return null;
  }

  return (
    <RouterContext.Consumer>
      {(context) => (
        <Branch
          path={props.index ? "/" : props.path}
          exact={Boolean(props.index || props.exact)}
          context={context}
          component={props.component}
        />
      )}
    </RouterContext.Consumer>
  );
};

export default Route;
