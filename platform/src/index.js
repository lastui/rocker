import * as actions from "./actions";
import * as constants from "./constants";

import { moduleLoaderMiddleware, dynamicMiddleware } from "./middleware";
import moduleLoader from "./loader";
import registerModule from "./register";

import Module from "./component/Module";
import Link from "./component/Link";
import Router, { useHistory, useLocation, useParams, useRouteMatch } from "./component/Router";
import Route from "./component/Route";

export {
	Module,
	Route,
	Link,
	Router,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	dynamicMiddleware,
	registerModule,
};

export default {
	Module,
	Route,
	Link,
	Router,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	dynamicMiddleware,
	registerModule,
};
