import { forwardRef, useMemo, useContext, createElement } from "react";

import { warning } from "../utils";
import { RouterContext, HistoryContext } from "./Router";

const LinkAnchor = forwardRef((props, ref) => {
  const composite = useMemo(() => {
    const { navigate, onClick, to, ...rest } = props;
    return {
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

  return props.children ? createElement("a", composite, props.children) : createElement("a", composite);
});

const Link = forwardRef((props, ref) => {
  const ctx = useContext(RouterContext);
  const history = useContext(HistoryContext);
  const composite = useMemo(() => {
    const { replace, to, component, href, ...rest } = props;
    const location = to.startsWith("/") ? to : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
    return {
      ...rest,
      ...(props.component ? {} : { to, href: href ? href : location }),
      navigate() {
        if (replace) {
          history.replace(location);
        } else {
          history.push(location);
        }
      },
      ref,
    };
  }, [props, ctx.match.url, history, ref]);
  return createElement(props.component || LinkAnchor, composite, props.children);
});

export default Link;