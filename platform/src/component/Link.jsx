import React from "react";
import { RouterContext } from "./Router";

function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const LinkAnchor = React.forwardRef(
  (
    {
      navigate,
      onClick,
      ...rest
    },
    forwardedRef
  ) => {
    const { target } = rest;

    let props = {
      ...rest,
      onClick: event => {
        try {
          if (onClick) onClick(event);
        } catch (ex) {
          event.preventDefault();
          throw ex;
        }

        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          (!target || target === "_self") &&
          !isModifiedEvent(event)
        ) {
          event.preventDefault();
          navigate();
        }
      }
    };

    props.ref = forwardedRef;

    return <a {...props} />;
  }
);


const Link = React.forwardRef(
  (
    {
      component = LinkAnchor,
      replace,
      to,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;

          const location = resolveToLocation(to, context.location);

          const href = location ? history.createHref(location) : "";
          const props = {
            ...rest,
            href,
            navigate() {
              const location = resolveToLocation(to, context.location);
              const method = replace ? history.replace : history.push;
              method(location);
            }
          };

          props.ref = forwardedRef;

          return React.createElement(component, props);
        }}
      </RouterContext.Consumer>
    );
  }
);

export default Link;