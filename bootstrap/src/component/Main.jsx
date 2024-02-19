/* global DEFAULT_LOCALE */

import { Children, StrictMode, useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";

import { constants, getStore, manualCleanup } from "@lastui/rocker/platform";

import { getIsInitialized, getLanguage } from "../selector";
import setupStore from "../store";

import Entrypoint from "./Entrypoint";
import Globalisation from "./Globalisation";

const FullyInitializedGate = (props) => {
  const initialized = useSelector(getIsInitialized);
  const locale = useSelector(getLanguage);
  /* istanbul ignore next */
  if (!initialized || !locale) {
    return null;
  }
  return Children.only(props.children);
};

const Main = (props) => {
  const [_, setErrorState] = useState();
  const [storeReady, markStoreReady] = useState(false);

  const manualInit = useCallback(() => {
    try {
      const store = setupStore(props.fetchContext, props.reduxMiddlewares);
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
  }, [markStoreReady, setErrorState, props.reduxMiddlewares, props.fetchContext, props.contextRefreshInterval]);

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
          <Globalisation>
            <Entrypoint />
          </Globalisation>
        </FullyInitializedGate>
      </ReduxProvider>
    </StrictMode>
  );
};

export default Main;
