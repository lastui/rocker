import React from "react";
import { useSelector } from "react-redux";
import moduleLoader from "../loader";

const Module = (props) => {
  const updatedAt = useSelector((state) => state.runtime.updatedAt);
  const [lastUpdate, setLastUpdate] = React.useState(0);

  const composite = React.useMemo(() => {
    const { name, fallback, ...owned } = props;
    return {
      owned,
      lastUpdate,
    };
  }, [props, lastUpdate]);

  React.useEffect(async () => {
    if (!props.name) {
      return;
    }
    const changed = await moduleLoader.loadModule(props.name);
    if (changed) {
      setLastUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
    }
  }, [props.name, updatedAt]);

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!props.name || !loadedModule || !loadedModule.view) {
    if (props.fallback) {
      return props.fallback();
    }
    return null;
  }

  return props.children
    ? React.createElement(loadedModule.view, composite, props.children)
    : React.createElement(loadedModule.view, composite);
};

export default Module;
