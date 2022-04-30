import React from "react";
import { useSelector } from "react-redux";
import { Module, Router } from "@lastui/rocker/platform";
import { getEntrypoint } from "../selector";
import { createBrowserHistory } from "history";
import Globalisation from './Globalisation';

const history = createBrowserHistory();

const Entrypoint = (props) => {
  const entrypoint = useSelector(getEntrypoint);
  if (entrypoint === null) {
    return null;
  }
  return (
    <Globalisation>
      <Router history={history}>
        <Module name={entrypoint}>{props.children}</Module>
      </Router>
    </Globalisation>
  );
};

export default Entrypoint;