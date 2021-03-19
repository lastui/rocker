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

  const { children, ...restProps } = props;

  if (!moduleComponent && !children) {
    return <React.Fragment />
  }

  return (
    <ModuleContextProvider moduleLoader={moduleLoader}>
      {moduleComponent
        ? React.createElement(moduleComponent, restProps, children)
        : children
      }
    </ModuleContextProvider>
  )
};

export default React.memo(Module);
