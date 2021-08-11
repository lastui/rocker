import * as actions from "./actions";
import * as constants from "./constants";

import moduleLoaderMiddleware from "./middleware";
import createModuleLoader from "./loader";
import registerModule from "./register";

import Module from "./component/Module";
import Route from "./component/Route";
import ModuleContext from "./component/ModuleContext";
import { Link } from 'react-router-dom';

export {
	Module,
	Route,
	Link,
	ModuleContext,
	actions,
	constants,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};

export default {
	Module,
	Route,
	Link,
	ModuleContext,
	actions,
	constants,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
