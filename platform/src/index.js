import * as actions from "./actions";
import * as constants from "./constants";
import { history } from "./routing";
import { ModuleContext, useModuleLoader } from "./ModuleContext";
import { createModuleLoader, moduleLoaderMiddleware } from "./modules";

const registerModule =
	process.env.NODE_ENV === "production"
		? require("./modules").registerModule
		: require("./development").registerModule;

const Module =
	process.env.NODE_ENV === "production"
		? require("./Module").default
		: require("./development").Module;

export {
	Module,
	ModuleContext,
	useModuleLoader,
	actions,
	constants,
	history,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};

export default {
	Module,
	ModuleContext,
	useModuleLoader,
	actions,
	constants,
	history,
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
