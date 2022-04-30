import { SET_LANGUAGE, REFRESH, SET_SHARED } from "./constants";

import registerModule from "./register";
import Module from "./component/Module";
import Link from "./component/Link";
import Router, { useLocation, useParams, useRouteMatch, useHistory } from "./component/Router";
import Route from "./component/Route";
import Redirect from "./component/Redirect";

function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    payload: {
      language,
    },
  };
}

function refresh() {
  return {
    type: REFRESH,
  };
}

function setShared(payload, isGlobal) {
  return {
    type: SET_SHARED,
    payload,
    local: !Boolean(isGlobal),
  };
}

const actions = {
  setLanguage,
  setShared,
  refresh,
};

export {
  Module,
  Route,
  Redirect,
  Link,
  Router,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch,
  actions,
  registerModule,
};

export default {
  Module,
  Route,
  Redirect,
  Link,
  Router,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch,
  actions,
  registerModule,
};