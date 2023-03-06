import React from "react";
import { useSelector } from "react-redux";
import { Module } from "@lastui/rocker/platform";
import { getEntrypoint } from "../selector";
import Globalisation from "./Globalisation";

import { BrowserRouter } from "react-router-dom";

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);
  console.log("entrypoint is", entrypoint);
  if (entrypoint === null) {
    return null;
  }
  console.log("rendering entrypoint");
  return (
    <Globalisation>
      <BrowserRouter>
        <Module name={entrypoint}>{props.children}</Module>
      </BrowserRouter>
    </Globalisation>
  );
};

export default Entrypoint;