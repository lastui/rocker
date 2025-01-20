import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";

import { Module } from "@lastui/rocker/platform";

import { getEntrypoint } from "../selector";

const BROWSER_ROUTER_FUTURE_OPTIONS = {
  v7_relativeSplatPath: true,
  v7_skipActionErrorRevalidation: true,
  v7_partialHydration: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
};

const ROUTER_PROVIDER_FUTURE_OPTIONS = {
  v7_startTransition: true,
};

const Hatch = createContext({});

const Yank = () => {
  const error = useRouteError();
  throw error;
};

const Sink = () => {
  const { children, entrypoint } = useContext(Hatch);

  return <Module name={entrypoint}>{children}</Module>;
};

export const router = createBrowserRouter([{ path: "*", element: <Sink />, errorElement: <Yank /> }], {
  basename: "/",
  future: BROWSER_ROUTER_FUTURE_OPTIONS,
});

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);

  const value = useMemo(() => ({ entrypoint, children: props.children }), [entrypoint, props.children]);

  if (entrypoint === null) {
    return null;
  }

  return (
    <Hatch.Provider value={value}>
      <RouterProvider router={router} future={ROUTER_PROVIDER_FUTURE_OPTIONS} />
    </Hatch.Provider>
  );
};

export default Entrypoint;
