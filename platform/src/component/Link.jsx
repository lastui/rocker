import { createElement, forwardRef, useMemo, useContext } from "react";
import { RouterContext, HistoryContext } from "./Router";

const LinkAnchor = forwardRef((props, ref) => {
  const composite = useMemo(() => {
    const { navigate, onClick, href, to, ...rest } = props;
    return {
      ...rest,
      href: href || `/${to}`.replace(/\/+/g, "/"),
      onClick: (event) => {
        try {
          if (onClick) {
            onClick(event);
          }
        } catch (err) {
          event.preventDefault();
          throw err;
        }

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
  return props.children
    ? createElement("a", composite, props.children)
    : createElement("a", composite);
});

const Link = forwardRef((props, ref) => {
  const ctx = useContext(RouterContext);
  const history = useContext(HistoryContext);
  const composite = useMemo(() => {
    const { component, replace, to, ...rest } = props;
    return {
      ...rest,
      to: props.component ? undefined : to,
      navigate() {
        const location = to.startsWith("/")
          ? to
          : `${ctx.match.url}/${to}`.replace(/\/+/g, "/");
        if (replace) {
          history.replace(location);
        } else {
          history.push(location);
        }
      },
      ref,
    };
  }, [props, ctx.match.url, history, ref]);
  return props.children
    ? createElement(props.component || LinkAnchor, composite, props.children)
    : createElement(props.component || LinkAnchor, composite);
});

export default Link;
