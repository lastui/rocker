import { forwardRef, useState, useMemo, useEffect, createElement, useCallback } from "react";
import { useSelector } from "react-redux";
import moduleLoader from "../loader";

const Module = forwardRef((props, ref) => {
  const updatedAt = useSelector((state) => state.shared.updatedAt);
  const isReady = useSelector((state) => Boolean(state.shared.readyModules[props.name]));

  const [lastUpdate, setLastUpdate] = useState(0);

  const composite = useMemo(() => {
    const { name, fallback, ...owned } = props;
    return {
      owned,
      ref,
      isReady,
      lastUpdate,
    };
  }, [ref, props, isReady, lastUpdate]);

  const loadModule = useCallback(async () => {
    if (!props.name) {
      return;
    }
    const changed = await moduleLoader.loadModule(props.name);
    if (changed) {
      setLastUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
    }
  }, [props.name, updatedAt]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  if (!props.name) {
    return null;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!isReady || !loadedModule) {
    if (props.fallback) {
      return props.fallback();
    }
    return null;
  }

  if (!loadedModule.view) {
    return null;
  }

  return props.children
    ? createElement(loadedModule.view, composite, props.children)
    : createElement(loadedModule.view, composite);
});

export default Module;
