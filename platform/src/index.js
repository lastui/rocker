import * as actions from "./actions";
import * as constants from "./constants";
import { ModuleContext, useModuleLoader } from "./ModuleContext";
import {
	registerModule,
	createModuleLoader,
	moduleLoaderMiddleware,
} from "./modules";
import Module from "./Module";

export {
	Module,
	ModuleContext,
	useModuleLoader,
	actions,
	constants,
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
	createModuleLoader,
	moduleLoaderMiddleware,
	registerModule,
};
