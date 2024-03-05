import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";

import { Module } from "@lastui/rocker/platform";

import { getEntrypoint } from "../selector";

const Hatch = createContext({});

const Yank = () => {
  const error = useRouteError();
  throw error;
};

const Sink = (props) => {
  const { children, entrypoint } = useContext(Hatch);

  return <Module name={entrypoint}>{children}</Module>;
};

export const router = createBrowserRouter([{ path: "*", element: <Sink />, errorElement: <Yank /> }], { basename: "/" });

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);

  if (entrypoint === null) {
    return null;
  }

  return (
    <Hatch.Provider value={{ entrypoint, children: props.children }}>
      <RouterProvider router={router} />
    </Hatch.Provider>
  );
};

export default Entrypoint;
