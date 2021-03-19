import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props = {}) => {
  console.log("in render of", props);

  const moduleLoader = useModuleLoader();

  // flickering because of this (render miss always)
  let [loadedModule, setLoadedModule] = useState(
    moduleLoader.getLoadedModule(props.name)
  );

  useEffect(() => {
    const name = props.name
    console.log('mount', name)
    if (name) {
      moduleLoader.loadModule(name).then((module) => {
        moduleLoader.setModuleMountState(name, true);
        setLoadedModule(module);
      });
    }
    return () => {
      console.log('unmount', name)
      if (name) {
        moduleLoader.setModuleMountState(name, false);
      }
    };
  }, [props.name]);

  //const loadedModule = moduleLoader.getLoadedModule(props.name);

  //console.log("module", props, "loadedModule", loadedModule);
  if (!loadedModule) {
    // FIXME does not update need to store loadedModule in state
    console.log("module", props, "not loaded");
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    console.log("module", props, "not does not have component");
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
//export default React.memo(Module, (props, nextProps) => !nextProps.frozen);
