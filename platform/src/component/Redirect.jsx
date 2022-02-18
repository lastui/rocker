import React from "react";

import { RouterContext, HistoryContext } from "./Router";

const Redirect = (props) => {
  const ctx = React.useContext(RouterContext);
  const history = React.useContext(HistoryContext);

  const from = React.useMemo(
    () => `${ctx.match.url}/${props.from}`.replace(/\/+/g, "/"),
    [ctx.match.url, props.from]
  );

  const to = React.useMemo(
    () => `${ctx.match.url}/${props.to}`.replace(/\/+/g, "/"),
    [ctx.match.url, props.to]
  );

  React.useEffect(() => {
    if (ctx.location.pathname === from) {
      history.replace(to);
    }
  }, [ctx.location.pathname, from, to, history]);

  return null;
};

export default Redirect;
