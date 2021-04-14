import React, { useEffect, useState } from "react";
import { ModuleContext, useModuleLoader } from "./ModuleContext";
import ErrorBoundary from './ErrorBoundary';

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
    moduleLoader.loadModule(name).then((item) => {
      if (item) {
        moduleLoader.setModuleMountState(name, true);
        setLoadedModule(item);  
      } else {
        setLoadedModule({});
      }
    });
    return () => {
      moduleLoader.setModuleMountState(name, false);
    };
  }, [props.name]);

  if (!props.name || !loadedModule) {
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div>
          {props.name}
        </div>
      )
    }
    return <React.Fragment />;
  }

  const ModuleComponent = loadedModule.root;

  return (
    <ErrorBoundary
      name={props.name}
      fallback={(error) => {
        if (process.env.NODE_ENV === 'development') {
          return (
            <div>
              <div>
                {props.name}
              </div>
              <div>
                {JSON.stringify(error, Object.getOwnPropertyNames(error))}
              </div>
            </div>
          )
        }
        return <React.Fragment />;
      }}
    >
      <ModuleContext.Provider value={moduleLoader}>
        <ModuleComponent {...props.options} />
      </ModuleContext.Provider>
    </ErrorBoundary>
  );
};

export default React.memo(Module);
