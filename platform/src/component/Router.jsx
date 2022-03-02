import { createContext, useContext, useRef, useMemo, useState } from "react";

import { matchPath } from "../routing";

export const HistoryContext = createContext();
export const RouterContext = createContext();

export function useHistory() {
  return useContext(HistoryContext);
}

export function useLocation() {
  return useContext(RouterContext).location;
}

export function useParams() {
  const match = useContext(RouterContext).match;
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  const ctx = useContext(RouterContext);
  return path ? matchPath(ctx.location.pathname, path, {}) : ctx.match;
}

const useInitEffect = (effect, observables) => {
  const cleanup = useRef();
  const _ = useMemo(() => {
    if (cleanup.current) {
      cleanup.current();
    }
    cleanup.current = effect();
  }, observables);
};

const Router = (props) => {
  const [location, setLocation] = useState(props.history.location);

  useInitEffect(
    () =>
      props.history.listen((action) => {
        setLocation(action.location);
      }),
    [props.history.listen, setLocation]
  );

  const composite = useMemo(
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
