import { StrictMode, useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { constants, getStore, manualCleanup } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from "./Entrypoint";
import Globalisation from "./Globalisation";

const Main = (props) => {
  const [_, setErrorState] = useState();
  const [ready, setReady] = useState(false);

  const manualInit = useCallback(() => {
    try {
      const store = setupStore(props.fetchContext, props.reduxMiddlewares);
      store.dispatch({
        type: constants.INIT,
        payload: {
          contextRefreshInterval: props.contextRefreshInterval,
        },
      });
      setReady(true);
    } catch (error) {
      setErrorState(() => {
        throw error;
      });
    }
  }, [setReady, props.reduxMiddlewares, props.fetchContext, props.contextRefreshInterval]);

  useEffect(() => {
    manualCleanup();
    manualInit();
    return () => {
      manualCleanup();
    };
  }, [manualInit]);

  if (!ready) {
    return null;
  }

  return (
    <StrictMode>
      <ReduxProvider store={getStore()}>
        <Globalisation>
          <Entrypoint />
        </Globalisation>
      </ReduxProvider>
    </StrictMode>
  );
};

export default Main;
