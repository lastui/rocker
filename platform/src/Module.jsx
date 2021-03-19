import React, { useEffect, useState, useMemo } from "react";
import { ModuleContextProvider, useModuleLoader } from "./ModuleContext";

const Module = (props) => {
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

  if (!loadedModule) {  // FIXME props.loading like react suspense
    return <React.Fragment />;
  }

  return useMemo(() => {
    const { children, ...restProps } = props;
    return (
      <ModuleContextProvider moduleLoader={moduleLoader}>
        {loadedModule.root
          ? React.createElement(loadedModule.root, restProps, children)
          : children
        }
      </ModuleContextProvider>
    )
  }, [props, loadedModule.root]);
};

export default Module;
