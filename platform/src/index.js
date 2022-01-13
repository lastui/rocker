import * as actions from "./actions";
import * as constants from "./constants";

import moduleLoaderMiddleware from "./middleware";
import moduleLoader from "./loader";
import registerModule from "./register";

import Module from "./component/Module";
import { Link, BrowserRouter, Route, InductiveRoute, Switch, useHistory, useLocation, useParams, useRouteMatch } from "./component/router";

export {
	Module,
	Route,
	InductiveRoute,
	Link,
	Switch,
	BrowserRouter,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	registerModule,
};

export default {
	Module,
	Route,
	InductiveRoute,
	Link,
	Switch,
	BrowserRouter,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
