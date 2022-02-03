import React from "react";
import { RouterContext } from "./Router";

function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
}

const LinkAnchor = React.forwardRef((props, ref) => {
  const composite = React.useMemo(() => {
    const { navigate, onClick, ...rest } = props;
    return {
      ...rest,
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
    ? React.createElement("a", composite, props.children)
    : React.createElement("a", composite);
});

const Link = React.forwardRef(
  ({ component = LinkAnchor, replace, to, ...rest }, ref) => (
    <RouterContext.Consumer>
      {(context) => {
        const location = resolveToLocation(to, context.location);

        const href = location ? context.history.createHref(location) : "";
        const props = {
          ...rest,
          href,
          navigate() {
            const location = resolveToLocation(to, context.location);
            const method = replace
              ? context.history.replace
              : context.history.push;
            method(location);
          },
        };

        props.ref = ref;

        return React.createElement(component, props);
      }}
    </RouterContext.Consumer>
  )
);

export default Link;
