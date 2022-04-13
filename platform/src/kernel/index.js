import * as constants from "../constants";

import registerModule from "../register";

import moduleLoaderMiddleware from "./middleware/loader";
import dynamicMiddleware from "./middleware/dynamic";
import moduleLoader from "./registry/loader";

import sharedState from "./reducer/shared";

import Module from "../component/Module";
import Link from "../component/Link";
import Router, {
	useLocation,
	useParams,
	useRouteMatch,
	useHistory,
} from "../component/Router";
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
	moduleLoader,
	moduleLoaderMiddleware,
	sharedState,
	dynamicMiddleware,
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
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	sharedState,
	dynamicMiddleware,
	registerModule,
};
