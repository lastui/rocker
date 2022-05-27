import { forwardRef, useState, useMemo, useEffect, createElement, useCallback } from "react";
import { useSelector } from "react-redux";

import moduleLoader from "../kernel/registry/loader";

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
      lastUpdate,
      lastLocalUpdate,
    };
  }, [ref, props, isReady, lastUpdate, lastLocalUpdate]);

  /* istanbul ignore next */
  const loadModule = useCallback(
    (signal) => {
      async function work() {
        if (!props.name) {
          return false;
        }
        return await moduleLoader.loadModule(props.name);
      }
      const abort = new Promise((resolve) => {
        signal.onabort = function () {
          resolve(false);
        };
      });
      Promise.race([work(), abort]).then((changed) => {
        if (changed) {
          setLastLocalUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
        }
      });
    },
    [props.name, isReady, lastUpdate],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadModule(controller.signal);
    return () => {
      controller.abort();
    };
  }, [loadModule]);

  if (!props.name) {
    return null;
  }

  const loadedModule = moduleLoader.getLoadedModule(props.name);

  if (!isReady || !loadedModule) {
    if (props.fallback) {
      return props.fallback(composite.owned);
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