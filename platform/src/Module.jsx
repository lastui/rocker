import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props) => {
  console.log('in render of', props)

  const moduleLoader = useModuleLoader();

  let [ready, setReady] = useState(false);

  useEffect(() => {
    if (moduleLoader !== null && props.name) {
      moduleLoader.loadModule(props.name).then(() => {
        moduleLoader.setModuleMountState(props.name, true);
        setReady(true);
      });
    }
    return () => {
      if (moduleLoader !== null && props.name) {
        moduleLoader.setModuleMountState(props.name, false);
      }
    };
  }, [props.name]);

  if (moduleLoader == null || !ready) {
    return <React.Fragment />;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!loadedModule) {
    return <div>{`Module [${props.name}] load failed ...`}</div>;
  }

  if (!loadedModule.root) {
    console.log('loadedModule is', loadedModule)
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
