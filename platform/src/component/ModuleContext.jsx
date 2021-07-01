import React from "react";

const ModuleContext = React.createContext(null);

const useModuleLoader = () => React.useContext(ModuleContext);

export { ModuleContext, useModuleLoader };

export default ModuleContext;
