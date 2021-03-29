import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props = {}) => {
  const moduleLoader = useModuleLoader();

  let [loadedModule, setLoadedModule] = useState(
    moduleLoader.getLoadedModule(props.name)
  );

  useEffect(() => {
    const name = props.name
    if (name) {
      moduleLoader.loadModule(name).then((module) => {
        moduleLoader.setModuleMountState(name, true);
        setLoadedModule(module);
      });
    }
    return () => {
      if (name) {
        moduleLoader.setModuleMountState(name, false);
      }
    };
  }, [props.name]);

  if (!loadedModule) {
    // FIXME does not update need to store loadedModule in state
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    return <React.Fragment />;
  }

  // FIXME if children?
  const ModuleComponent = loadedModule.root;

  return (
    <ModuleContextProvider moduleLoader={moduleLoader}>
      <ModuleComponent {...props.options} />
    </ModuleContextProvider>
  );
};

export default React.memo(Module);
