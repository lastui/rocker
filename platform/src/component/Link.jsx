import React from "react";

import { warning } from "../utils";
import { RouterContext, HistoryContext } from "./Router";

const LinkAnchor = React.forwardRef((props, ref) => {
  const composite = React.useMemo(() => {
    const { navigate, onClick, to, ...rest } = props;
    return {
      href: props.to,
      ...rest,
      onClick: (event) => {
        try {
          if (onClick) {
            onClick(event);
          }
        } catch (err) {
          event.preventDefault();
          warning("onClick handler of Link component errored", err);
          return;
        }
        /* istanbul ignore next */
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          (!rest.target || rest.target === "_self") &&
          !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
        ) {
          event.preventDefault();
          navigate();
        }
      },
      ref,
    };
  }, [props, ref]);

  return props.children ? React.createElement("a", composite, props.children) : React.createElement("a", composite);
});

const Link = React.forwardRef((props, ref) => {
  const ctx = React.useContext(RouterContext);
  const history = React.useContext(HistoryContext);
  const composite = React.useMemo(() => {
    const { replace, to, component, ...rest } = props;
    return {
      ...rest,
      ...(props.component ? {} : { to }),
      navigate() {
        const location = to.startsWith("/") ? to : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
        if (replace) {
          history.replace(location);
        } else {
          history.push(location);
        }
      },
      ref,
    };
  }, [props, ctx.match.url, history, ref]);
  return React.createElement(props.component || LinkAnchor, composite, props.children);
});

export default Link;