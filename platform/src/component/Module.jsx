import React from "react";
import { useSelector } from "react-redux";
import { useModuleLoader } from "./ModuleContext";
import ErrorBoundary from "./ErrorBoundary";

const Module = (props) => {
  const moduleLoader = useModuleLoader();
  const isLoaded = useSelector((state) =>
    Boolean(state.shared.loaded[props.name])
  );
  const buster = useSelector((state) => state.shared.buster);

  React.useEffect(() => {
    if (!props.name) {
      return;
    }
    moduleLoader.loadModule(props.name);
  }, [props.name, buster]);

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!props.name || !loadedModule) {
    if (props.fallback) {
      return props.fallback();
    }
    return <React.Fragment />;
  }

  if (!loadedModule?.mainView) {
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
    <ErrorBoundary name={props.name} fallback={loadedModule.errorView}>
      {React.createElement(loadedModule.mainView, rest, props.children)}
    </ErrorBoundary>
  );
};

export default Module;
