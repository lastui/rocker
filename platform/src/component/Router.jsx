import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useMemo,
  useState,
} from "react";

import { matchPath } from "../routing";

export const HistoryContext = createContext();
export const RouterContext = createContext();

export function useLocation() {
  return useContext(RouterContext).location;
}

export function useParams() {
  const match = useContext(RouterContext).match;
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  const ctx = useContext(RouterContext);
  const result = useMemo(
    () => (path ? matchPath(ctx.location.pathname, ctx.match.parent+path, {}) : ctx.match),
    [path, ctx.location.pathname, ctx.match]
  );
  return result;
}

export function useHistory() {
  const ctx = useContext(RouterContext);
  const history = useContext(HistoryContext);

  const replace = useCallback(
    (to) => {
      const location = to.startsWith("/")
        ? to
        : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
      history.replace(location);
    },
    [history.replace, ctx.match.url]
  );

  const push = useCallback(
    (to) => {
      const location = to.startsWith("/")
        ? to
        : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
      history.push(location);
    },
    [history.push, ctx.match.url]
  );

  return {
    push,
    replace,
  };
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
        node: "/",
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
