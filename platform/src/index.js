import * as actions from "./actions";
import * as constants from "./constants";

import moduleLoaderMiddleware from "./middleware";
import moduleLoader from "./loader";
import registerModule from "./register";

import Module from "./component/Module";
import Route from "./component/Route";
import { Link } from 'react-router-dom';

export {
	Module,
	Route,
	Link,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	registerModule,
};

export default {
	Module,
	Route,
	Link,
	actions,
	constants,
	moduleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
