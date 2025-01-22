import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router";

import { Module } from "@lastui/rocker/platform";

import { getEntrypoint } from "../selector";

const Hatch = createContext({});

const Yank = () => {
  const error = useRouteError();
  throw error;
};

const Sink = () => {
  const { children, entrypoint } = useContext(Hatch);

  return <Module name={entrypoint}>{children}</Module>;
};

export const router = createBrowserRouter([{ path: "*", element: <Sink />, errorElement: <Yank /> }], { basename: "/" });

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);

  const value = useMemo(() => ({ entrypoint, children: props.children }), [entrypoint, props.children]);

  if (entrypoint === null) {
    return null;
  }

  return (
    <Hatch.Provider value={value}>
      <RouterProvider router={router} />
    </Hatch.Provider>
  );
};

export default Entrypoint;
