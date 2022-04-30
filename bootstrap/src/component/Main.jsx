import { StrictMode, useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { constants, getStore } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from "./Entrypoint";

const Main = (props) => {
  const [_, setErrorState] = useState();
  const [ready, setReady] = useState(false);

  const bootstrap = useCallback(() => {
    console.debug("bootstraping runtime");
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
    bootstrap();
  }, [bootstrap]);

  if (!ready) {
    return null;
  }

  return (
    <StrictMode>
      <ReduxProvider store={getStore()}>
        <Entrypoint />
      </ReduxProvider>
    </StrictMode>
  );
};

export default Main;