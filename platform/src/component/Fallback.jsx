import { createElement, useEffect, useState, isValidElement } from "react";

const Fallback = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setVisible]);

  if (!visible) {
    return null;
  }

  if (isValidElement(props.children)) {
    return props.children;
  }

  return createElement(props.children, props);
};

export default Fallback;
