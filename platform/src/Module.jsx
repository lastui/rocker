import React from "react";
import { ModuleContext, useModuleLoader } from "./ModuleContext";
import ErrorBoundary from "./ErrorBoundary";

const Module = (props) => {
  const moduleLoader = useModuleLoader();

  let [loadedModule, setLoadedModule] = React.useState(
    moduleLoader.getLoadedModule(props.name)
  );

  const errorFallback = React.useMemo(
    () => (error) => {
      if (process.env.NODE_ENV === "development") {
        return (
          <div>
            <div>{props.name}</div>
            <div>
              {JSON.stringify(error, Object.getOwnPropertyNames(error))}
            </div>
          </div>
        );
      }
      return <React.Fragment />;
    },
    [props.name]
  );

  React.useEffect(() => {
    if (!props.name) {
      return;
    }
    const name = props.name;
    moduleLoader.loadModule(name).then((item) => {
      moduleLoader.setModuleMountState(name, true);
      if (item) {
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
    if (props.fallback) {
      return props.fallback();
    }
    return <React.Fragment />;
  }

  if (!loadedModule.root) {
    if (props.fallback) {
      return props.fallback();
    }
    if (process.env.NODE_ENV === "development") {
      return <div>{props.name}</div>;
    }
    return <React.Fragment />;
  }

  return (
    <ErrorBoundary name={props.name} fallback={errorFallback}>
      <ModuleContext.Provider value={moduleLoader}>
        {React.createElement(loadedModule.root, props, props.children)}
      </ModuleContext.Provider>
    </ErrorBoundary>
  );
};

export default React.memo(Module);