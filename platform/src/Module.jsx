import React, { useEffect, useState } from "react";
import { /*ModuleContextProvider, */ useModuleLoader } from "./ModuleContext";

const Module = (props) => {
  const moduleLoader = useModuleLoader();

  let [ready, setReady] = useState(false);

  useEffect(() => {
    if (moduleLoader !== null && props.name) {
      if (moduleLoader.isModuleLoaded(props.name)) {
        setReady(true);
      } else {
        moduleLoader.loadModule(props.name).then(() => {
          moduleLoader.setModuleMountState(props.name, true);
          setReady(true);
        });
      }
    }
    return () => {
      if (moduleLoader !== null && props.name) {
        moduleLoader.setModuleMountState(props.name, false);
      }
    };
  }, [props.name]);

  if (!moduleLoader || !ready) {
    return <React.Fragment />;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!loadedModule) {
    return <div>{`Module [${props.name}] load failed ...`}</div>;
  }

  const ModuleComponent = loadedModule.root;

  return ModuleComponent ? (
    <ModuleComponent {...props.options} />
  ) : (
    <div>{`Module [${props.name}] is missing root view ...`}</div>
  );

  /*
  const ModuleComponent = loadedModule.root
  return ModuleComponent
    ? (
        <ModuleContextProvider moduleLoader={moduleLoader}>
          <ModuleComponent {...props.options} />
        </ModuleContextProvider>
      )
    : <div>{`Module [${props.name}] is missing root view ...`}</div>
  */
};

export default Module;
//export default React.memo(Module, (props, nextProps) => !nextProps.frozen);
