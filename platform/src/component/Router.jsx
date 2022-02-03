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

const Router = (props) => {
  const [location, setLocation] = React.useState({
    pathname: props.history.location.pathname,
    hash: props.history.location.hash,
    search: props.history.location.search,
  })

  const composite = React.useMemo(() => ({
    history: props.history,
    location,
    match: {
      path: "/",
      url: "/",
      params: {},
      isExact: location.pathname === "/",
    }
  }), [props.history, location])

  React.useEffect(() => {
    const unlisten = props.history.listen((action) => {
      setLocation({
        pathname: action.location.pathname,
        hash: action.location.hash,
        search: action.location.search,
      })
    });
    return unlisten;
  }, [props.history])

  return (
    <RouterContext.Provider value={composite}>
      <HistoryContext.Provider
        children={props.children || null}
        value={props.history}
      />
    </RouterContext.Provider>
  );
}

export default Router;
