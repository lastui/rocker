import { Children, StrictMode, useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";

import { constants, getStore, manualCleanup } from "@lastui/rocker/platform";

import { getIsInitialized, getLanguage } from "../selector";
import setupStore from "../store";

import Entrypoint, { router } from "./Entrypoint";
import Globalisation from "./Globalisation";

const DEFAULT_LOCALE = "en-US";

const FullyInitializedGate = (props) => {
  const initialized = useSelector(getIsInitialized);
  const locale = useSelector(getLanguage);
  // v8 ignore next 3
  if (!initialized || !locale) {
    return null;
  }
  return Children.only(props.children);
};

const Main = (props) => {
  const [_errorState, setErrorState] = useState();
  const [storeReady, markStoreReady] = useState(false);

  const manualInit = useCallback(() => {
    try {
      const store = setupStore(router, props.fetchContext, props.reduxMiddlewares);
      store.dispatch({
        type: constants.SET_LANGUAGE,
        payload: {
          language: props.defaultLocale ?? DEFAULT_LOCALE,
        },
      });
      store.dispatch({
        type: constants.INIT,
        payload: {
          contextRefreshInterval: props.contextRefreshInterval,
        },
      });
      markStoreReady(true);
    } catch (error) {
      setErrorState(() => {
        throw error;
      });
    }
  }, [
    markStoreReady,
    setErrorState,
    props.defaultLocale,
    props.reduxMiddlewares,
    props.fetchContext,
    props.contextRefreshInterval,
  ]);

  useEffect(() => {
    manualCleanup();
    manualInit();
    return () => {
      manualCleanup();
    };
  }, [manualInit]);

  if (!storeReady) {
    return null;
  }

  return (
    <StrictMode>
      <ReduxProvider store={getStore()}>
        <FullyInitializedGate>
          <Globalisation defaultLocale={props.defaultLocale ?? DEFAULT_LOCALE}>
            <Entrypoint />
          </Globalisation>
        </FullyInitializedGate>
      </ReduxProvider>
    </StrictMode>
  );
};

export default Main;
