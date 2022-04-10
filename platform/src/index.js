import { SET_LANGUAGE, REFRESH } from "./constants";

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

const constants = { SET_LANGUAGE, REFRESH };

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
};
