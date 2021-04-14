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
    if (process.env.NODE_ENV === 'development') {
      return (
        <div>
          {`Module ${props.name} not loaded`}
        </div>
      )
    }
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    return <React.Fragment />;
  }

  const ModuleComponent = loadedModule.root;

  return (
    <ErrorBoundary
      fallback={(error) => {
        if (process.env.NODE_ENV === 'development') {
          return (
            <div>
              <div>
              {`Module ${props.name} crashed`}
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
