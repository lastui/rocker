import { StrictMode, useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { constants } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from "./Entrypoint";

const Main = (props) => {
  const [_, setErrorState] = useState();
  const [store, setStore] = useState();

  const bootstrap = useCallback(async () => {
    console.debug("bootstraping runtime");
    try {
      const nextStore = await setupStore(props.fetchContext, props.reduxMiddlewares);
      nextStore.dispatch({
        type: constants.INIT,
        payload: {
          initializeRuntime: props.initializeRuntime,
          contextRefreshInterval: props.contextRefreshInterval,
        },
      });
      setStore(nextStore);
    } catch (error) {
      setErrorState(() => {
        throw error;
      });
    }
  }, [props.reduxMiddlewares, props.fetchContext, props.initializeRuntime, props.contextRefreshInterval]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!store) {
    return null;
  }

  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <Entrypoint />
      </ReduxProvider>
    </StrictMode>
  );
};

export default Main;
