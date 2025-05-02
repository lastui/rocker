import { useState, useMemo, useEffect, createElement } from "react";
import { useSelector } from "react-redux";

import moduleLoader from "../kernel/registry/loader";

import Fallback from "./Fallback";

const Module = (props) => {
  const isReady = useSelector((state) => props.name in state.env.readyModules);

  const lastUpdate = useSelector((state) => state.env.lastUpdate);

  const [lastLocalUpdate, setLastLocalUpdate] = useState(0);

  const available = useMemo(() => moduleLoader.isAvailable(props.name), [props.name, lastLocalUpdate, lastUpdate]);

  const composite = useMemo(() => {
    const { name, fallback, children, ref, ...owned } = props;
    return { owned, ref };
  }, [props]);

  useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      /* istanbul ignore next */
      moduleLoader.loadModule(props.name, controller).then((changed) => {
        if (controller.aborted) {
          return;
        }
        if (changed) {
          setLastLocalUpdate((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
        }
      });
    });

    return () => {
      controller.abort();
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
};

export default Module;
