import { forwardRef, useState, useMemo, useEffect, createElement } from "react";
import { useSelector } from "react-redux";

import moduleLoader from "../kernel/registry/loader";

import Fallback from "./Fallback";

const Module = forwardRef((props, ref) => {
  const isReady = useSelector((state) => props.name in state.env.readyModules);

  const lastUpdate = useSelector((state) => state.env.lastUpdate);

  const [lastLocalUpdate, setLastLocalUpdate] = useState(0);

  const composite = useMemo(() => {
    const { name, fallback, ...owned } = props;
    return {
      owned,
      ref,
    };
  }, [ref, props]);

  const available = useMemo(() => moduleLoader.isAvailable(props.name), [props.name, lastLocalUpdate, lastUpdate]);

  // TODO when react19 is available refactor with useTransition with async support
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
      const error = new Error(`Module(${props.name}) hook`);
      error.name = "AbortError";
      controller.abort(error);
    };
  }, [setLastLocalUpdate, props.name, available]);

  if (!props.name || !available) {
    return null;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!isReady || !loadedModule) {
    if (props.fallback && moduleLoader.isModuleLoading(props.name)) {
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
