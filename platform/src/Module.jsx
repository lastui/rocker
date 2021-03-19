import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props = {}) => {
  console.log("in render of", props);

  const moduleLoader = useModuleLoader();

  // flickering because of this (render miss always)
  //let [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("use effect observed update", props.name);
    if (props.name) {
      moduleLoader.loadModule(props.name).then(() => {
        moduleLoader.setModuleMountState(props.name, true);
        //setReady(true);
      });
    }
    return () => {
      if (props.name) {
        moduleLoader.setModuleMountState(props.name, false);
      }
    };
  }, [props.name]);

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!loadedModule) {
    console.log('module', props, 'not loaded')
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    console.log("loadedModule is", loadedModule);
    return <div>{`Module [${props.name}] is missing MainView ...`}</div>;
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
