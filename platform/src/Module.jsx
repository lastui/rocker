import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props = {}) => {
  const moduleLoader = useModuleLoader();

  let [loadedModule, setLoadedModule] = useState(
    moduleLoader.getLoadedModule(props.name)
  );

  useEffect(() => {
    console.log("mount", props.name);
    //console.log("use effect observed update", props.name);
    if (props.name) {
      moduleLoader.loadModule(props.name).then((module) => {
        moduleLoader.setModuleMountState(props.name, true);
        setLoadedModule(module);
      });
    }
    return () => {
      if (props.name) {
        console.log("unmount", props.name);
        moduleLoader.setModuleMountState(props.name, false);
      }
    };
  }, [props.name]);

  if (!loadedModule) {  // FIXME props.loading
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    return (
      <ModuleContextProvider moduleLoader={moduleLoader}>
        {props.children}
      </ModuleContextProvider>
    );
  }

  const ModuleComponent = loadedModule.root;

  return (
    <ModuleContextProvider moduleLoader={moduleLoader}>
      <ModuleComponent {...props.options} />
    </ModuleContextProvider>
  );
};

export default Module;
//export default React.memo(Module, (props, nextProps) => !nextProps.frozen);
