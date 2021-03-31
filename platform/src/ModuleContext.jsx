import React from "react";

const ModuleContext = React.createContext(null);

const ModuleContextProvider = (props) => (
	<ModuleContext.Provider value={props.moduleLoader || null}>
		{props.moduleLoader ? props.children : <React.Fragment />}
	</ModuleContext.Provider>
);

ModuleContextProvider.displayName = "ModuleContextProvider"

const useModuleLoader = () => React.useContext(ModuleContext);

export { ModuleContextProvider, useModuleLoader };

export default ModuleContextProvider;
