import React from "react";
import { useSelector } from "react-redux";
import { useModuleLoader } from "./ModuleContext";

const Module = (props) => {
  const moduleLoader = useModuleLoader();
  const updatedAt = useSelector((state) => state.runtime.updatedAt);
  const [lastUpdate, setLastUpdate] = React.useState(0);

  React.useEffect(() => {
    if (!props.name) {
      return;
    }
    moduleLoader.loadModule(props.name).then((changed) => {
      if (changed) {
        setLastUpdate((tick) => tick + 1);
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

  if (!loadedModule.view) {
    if (props.fallback) {
      return props.fallback();
    }
    return <React.Fragment />;
  }

  const { name, fallback, ...owned } = props;

  const composite = {
    owned,
    lastUpdate,
  };

  return props.children
    ? React.createElement(loadedModule.view, composite, props.children)
    : React.createElement(loadedModule.view, composite);
};

export default Module;
