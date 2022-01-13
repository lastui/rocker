import React from "react";
import Router from "./Router";
import { createBrowserHistory } from "history";

class BrowserRouter extends React.Component {
  history = createBrowserHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter;