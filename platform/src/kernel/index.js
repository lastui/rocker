import * as constants from "../constants";

import registerModule from "../register";

import moduleLoaderMiddleware from "./middleware/loader";
import createSagaMiddleware from "./middleware/saga";
import dynamicMiddleware from "./middleware/dynamic";
import { getStore, setStore } from "./registry/store";
import sharedReducer from "./reducer/shared";
import modulesReducer from "./reducer/modules";

import Module from "../component/Module";
import Link from "../component/Link";
import Router, { useLocation, useParams, useRouteMatch, useHistory } from "../component/Router";
import Route from "../component/Route";
import Redirect from "../component/Redirect";

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
  constants,
  moduleLoaderMiddleware,
  sharedReducer,
  modulesReducer,
  dynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
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
  constants,
  moduleLoaderMiddleware,
  sharedReducer,
  modulesReducer,
  dynamicMiddleware,
  createSagaMiddleware,
  registerModule,
  getStore,
  setStore,
};