import React from "react";
import { useSelector } from "react-redux";
import { useModuleLoader } from "./ModuleContext";
import ErrorBoundary from "./ErrorBoundary";

const useForceUpdate = () => {
  const set = React.useState(0)[1];
  return () => set((s) => s + 1);
};

const Module = (props) => {
  const moduleLoader = useModuleLoader();
  const updatedAt = useSelector((state) => state.runtime.updatedAt);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    if (!props.name) {
      return;
    }
    moduleLoader.loadModule(props.name).then((changed) => {
      if (changed) {
        forceUpdate();
      }
    });
  }, [props.name, updatedAt]);

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!props.name || !loadedModule) {
    if (props.fallback) {
      return props.fallback();
    }
    return <React.Fragment />;
  }

  if (!loadedModule.mainView) {
    if (props.fallback) {
      return props.fallback();
    }
    if (process.env.NODE_ENV === "development") {
      return <div>{props.name}</div>;
    }
    return <React.Fragment />;
  }

  const { name, fallback, ...rest } = props;
  return (
    <ErrorBoundary name={name} fallback={loadedModule.errorView}>
      {React.createElement(loadedModule.mainView, rest, props.children)}
    </ErrorBoundary>
  );
};

export default Module;
