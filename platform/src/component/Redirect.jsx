import { useMemo, useContext, useEffect } from "react";

import { RouterContext, HistoryContext } from "./Router";

const Redirect = (props) => {
  const ctx = useContext(RouterContext);
  const history = useContext(HistoryContext);

  const from = useMemo(() => `${ctx.match.url}/${props.from}`.replace(/\/+/g, "/"), [ctx.match.url, props.from]);

  const to = useMemo(() => `${ctx.match.url}/${props.to}`.replace(/\/+/g, "/"), [ctx.match.url, props.to]);

  useEffect(() => {
    if (ctx.location.pathname === from) {
      history.replace(to);
    }
  }, [ctx.location.pathname, from, to, history]);

  return null;
};

export default Redirect;