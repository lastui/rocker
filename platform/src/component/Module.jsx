import { forwardRef, useState, useMemo, useEffect, createElement, useCallback } from "react";
import { useSelector } from "react-redux";

import moduleLoader from "../kernel/registry/loader";
import Fallback from "./Fallback";

const Module = forwardRef((props, ref) => {
  const isReady = useSelector((state) => Boolean(state.shared.readyModules[props.name]));

  const lastUpdate = useSelector((state) => state.shared.lastUpdate);

  const [lastLocalUpdate, setLastLocalUpdate] = useState(0);

  const composite = useMemo(() => {
    const { name, fallback, ...owned } = props;
    return {
      owned,
      ref,
      isReady,
      lastLocalUpdate,
    };
  }, [ref, props, isReady, lastLocalUpdate]);

  useEffect(() => {
    setLastLocalUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
  }, [setLastLocalUpdate, lastUpdate]);

  useEffect(() => {
    const controller = new AbortController();

    /* istanbul ignore next */
    moduleLoader.loadModule(props.name, controller).then((changed) => {
      if (controller.signal.aborted) {
        return;
      }
      if (changed) {
        setLastLocalUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
      }
    });

    return () => {
      const error = new Error(`Module(${props.name}) unmount`);
      error.name = "AbortError";
      controller.abort(error);
    };
  }, [setLastLocalUpdate, props.name]);

  const available = moduleLoader.isAvailable(props.name);

  if (!props.name || !available) {
    return null;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!isReady || !loadedModule) {
    if (props.fallback) {
      return createElement(Fallback, composite.owned, props.fallback);
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
