import * as actions from "./actions";
import * as constants from "./constants";

import { moduleLoaderMiddleware, dynamicMiddleware } from "./middleware";
import moduleLoader from "./loader";
import registerModule from "./register";
import sharedState from "./shared";

import Module from "./component/Module";
import Link from "./component/Link";
import Router, {
	useLocation,
	useParams,
	useRouteMatch,
	useHistory,
} from "./component/Router";
import Route from "./component/Route";
import Redirect from "./component/Redirect";

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
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	sharedState,
	dynamicMiddleware,
	registerModule,
};
