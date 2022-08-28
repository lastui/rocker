import React from "react";
import { useSelector } from "react-redux";
import { Module } from "@lastui/rocker/platform";
import { getEntrypoint } from "../selector";
import { createBrowserHistory } from "history";
import Globalisation from "./Globalisation";

import { BrowserRouter } from "react-router-dom";

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);
  if (entrypoint === null) {
    return null;
  }
  return (
    <Globalisation>
      <BrowserRouter>
        <Module name={entrypoint}>{props.children}</Module>
      </BrowserRouter>
    </Globalisation>
  );
};

export default Entrypoint;