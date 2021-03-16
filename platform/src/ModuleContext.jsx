import React from 'react';

const ModuleContext = React.createContext(null);

const ModuleContextProvider = (props) => (
  <ModuleContext.Provider
    value={props.moduleLoader}
  >
    {props.children}
  </ModuleContext.Provider>
);

const useModuleLoader = () => React.useContext(ModuleContext);

export { ModuleContextProvider, useModuleLoader };

export default ModuleContextProvider;
