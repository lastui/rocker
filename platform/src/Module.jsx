import React, { useEffect, useState } from "react";
import { ModuleContext, useModuleLoader } from "./ModuleContext";

const Module = (props = {}) => {
  const moduleLoader = useModuleLoader();

  let [loadedModule, setLoadedModule] = useState(
    moduleLoader.getLoadedModule(props.name)
  );

  useEffect(() => {
    if (!props.name) {
      return;
    }
    const name = props.name;
    moduleLoader.loadModule(name).then((module) => {
      moduleLoader.setModuleMountState(name, true);
      setLoadedModule(module);
    });
    return () => {
      moduleLoader.setModuleMountState(name, false);
    };
  }, [props.name]);

  if (!props.name) {
    return <React.Fragment />;
  }

  if (!loadedModule) {
    console.debug(`module ${props.name} is not loaded`);
    // FIXME does not update need to store loadedModule in state
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    console.debug(`module ${props.name} does not have view`);
    return <React.Fragment />;
  }

  console.debug(`module ${props.name} ready`);
  // FIXME if children?
  const ModuleComponent = loadedModule.root;

  return (
    <ModuleContext.Provider value={moduleLoader}>
      <ModuleComponent {...props.options} />
    </ModuleContext.Provider>
  );
};

export default React.memo(Module);
