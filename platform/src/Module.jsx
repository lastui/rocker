import React, { useEffect, useState } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props) => {
  const moduleLoader = useModuleLoader();

  let [moduleComponent, setModuleComponent] = useState(
    moduleLoader.getModuleComponent(props.name)
  );

  useEffect(() => {
    console.log("mount", props.name);
    //console.log("use effect observed update", props.name);
    if (props.name) {
      moduleLoader.loadModule(props.name).then((module) => {
        moduleLoader.setModuleMountState(props.name, true);
        setModuleComponent(module);
      });
    }
    return () => {
      if (props.name) {
        console.log("unmount", props.name);
        moduleLoader.setModuleMountState(props.name, false);
      }
    };
  }, [props.name]);

  if (!moduleComponent) {
    console.log('module', props.name, 'does not have component or is not loaded')
    return (
      <ModuleContextProvider moduleLoader={moduleLoader}>
        {props.children}
      </ModuleContextProvider>
    );
  }

  console.log('module', props.name, 'rendering')

  const ModuleComponent = moduleComponent;
  return (
    <ModuleContextProvider moduleLoader={moduleLoader}>
      <ModuleComponent {...props.options} />
    </ModuleContextProvider>
  );
};

export default React.memo(Module);
//export default React.memo(Module, (props, nextProps) => !nextProps.frozen);
