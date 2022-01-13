import React from "react";

import RouterContext from "./RouterContext.js";
import HistoryContext from "./HistoryContext.js";
import matchPath from "./matchPath.js";

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
  const location = useLocation();
  const match = React.useContext(RouterContext).match;
  return path ? matchPath(location.pathname, path) : match;
}
