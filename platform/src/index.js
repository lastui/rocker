import * as actions from "./actions";
import * as constants from "./constants";

import moduleLoaderMiddleware from "./middleware";
import createModuleLoader from "./loader";
import registerModule from "./register";

import Module from "./component/Module";
import ModuleContext from "./component/ModuleContext";

export {
	Module,
	ModuleContext,
	actions,
	constants,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};

export default {
	Module,
	ModuleContext,
	actions,
	constants,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
