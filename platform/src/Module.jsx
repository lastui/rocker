import React from "react";
import { useModuleLoader } from "./ModuleContext";
import ErrorBoundary from "./ErrorBoundary";

const Module = (props) => {
  const moduleLoader = useModuleLoader();

  let [loadedModule, setLoadedModule] = React.useState(
    moduleLoader.getLoadedModule(props.name)
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

  console.log('Module', props.name, 'loaded?', loadedModule)

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
    <ErrorBoundary name={props.name} fallback={loadedModule.errorView}>
      {React.createElement(loadedModule.mainView, rest, props.children)}
    </ErrorBoundary>
  );
};

export default Module;
