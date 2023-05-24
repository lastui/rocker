import { useMemo, Fragment } from "react";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import { Module } from "@lastui/rocker/platform";
import { getEntrypoint } from "../selector";
import Globalisation from "./Globalisation";

const BubbleError = () => {
  const error = useRouteError();
  throw error;
};

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);

  const router = useMemo(() => {
    if (entrypoint === null) {
      return null;
    }
    return createBrowserRouter([
      {
        path: "*",
        element: <Module name={entrypoint}>{props.children}</Module>,
        errorElement: <BubbleError />,
      },
    ]);
  }, [entrypoint, Boolean(props.children)]);

  if (entrypoint === null) {
    return null;
  }

  return (
    <Globalisation>
      <RouterProvider router={router} />
    </Globalisation>
  );
};

export default Entrypoint;
