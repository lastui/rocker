import React from "react";

import { matchPath } from "../kernel/routing";

export const HistoryContext = React.createContext();
export const RouterContext = React.createContext();

export function useLocation() {
  return React.useContext(RouterContext).location;
}

export function useParams() {
  const match = React.useContext(RouterContext).match;
  /* istanbul ignore next */
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  const ctx = React.useContext(RouterContext);
  return React.useMemo(
    () => (path ? matchPath(ctx.location.pathname, ctx.match.parent + path, true) : ctx.match),
    [path, ctx.location.pathname, ctx.match],
  );
}

export function useHistory() {
  const ctx = React.useContext(RouterContext);
  const history = React.useContext(HistoryContext);

  const replace = React.useCallback(
    (to) => {
      const location = to.startsWith("/") ? to : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
      history.replace(location);
    },
    [history.replace, ctx.match.url],
  );

  const push = React.useCallback(
    (to) => {
      const location = to.startsWith("/") ? to : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
      history.push(location);
    },
    [history.push, ctx.match.url],
  );

  return {
    push,
    replace,
  };
}

const useInitEffect = (effect, observables) => {
  const cleanup = React.useRef();
  const _ = React.useMemo(() => {
    /* istanbul ignore next */
    if (cleanup.current) {
      cleanup.current();
    }
    cleanup.current = effect();
  }, observables);
};

const Router = (props) => {
  const [location, setLocation] = React.useState(props.history.location);

  /* istanbul ignore next */
  useInitEffect(
    () =>
      props.history.listen((action) => {
        setLocation(action.location);
      }),
    [props.history.listen, setLocation],
  );

  const composite = React.useMemo(
    () => ({
      location,
      match: {
        path: "/",
        url: "/",
        parent: "",
        params: {},
        isExact: location.pathname === "/",
      },
    }),
    [location],
  );

  return (
    <RouterContext.Provider value={composite}>
      <HistoryContext.Provider children={props.children || null} value={props.history} />
    </RouterContext.Provider>
  );
};

export default Router;