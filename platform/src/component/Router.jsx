import React from "react";

import { matchPath } from "../routing";

export const HistoryContext = React.createContext();
export const RouterContext = React.createContext();

export function useHistory() {
  return React.useContext(HistoryContext);
}

export function useLocation() {
  return React.useContext(RouterContext).location;
}

export function useParams() {
  const match = React.useContext(RouterContext).match;
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  const ctx = React.useContext(RouterContext);
  return path ? matchPath(ctx.location.pathname, path, {}) : ctx.match;
}

const useInitEffect = (effect, observables) => {
  const cleanup = React.useRef();
  const _ = React.useMemo(() => {
    if (cleanup.current) {
      cleanup.current();
    }
    cleanup.current = effect();
  }, observables);
};

const Router = (props) => {
  const [location, setLocation] = React.useState(props.history.location);

  useInitEffect(
    () =>
      props.history.listen((action) => {
        setLocation(action.location);
      }),
    [props.history.listen, setLocation]
  );

  const composite = React.useMemo(
    () => ({
      location,
      match: {
        path: "/",
        url: "/",
        params: {},
        isExact: location.pathname === "/",
      },
    }),
    [location]
  );

  return (
    <RouterContext.Provider value={composite}>
      <HistoryContext.Provider
        children={props.children || null}
        value={props.history}
      />
    </RouterContext.Provider>
  );
};

export default Router;
