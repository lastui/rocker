import { createElement, useEffect, useState, isValidElement } from "react";

const Fallback = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startTime = top.document.timeline.currentTime;
    let frameID;
    const checkTime = (currentTime) => {
      if (currentTime - startTime >= 1000) {
        setVisible(true);
      } else {
        frameID = requestAnimationFrame(checkTime);
      }
    };
    frameID = requestAnimationFrame(checkTime);
    return () => {
      cancelAnimationFrame(frameID);
    };
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
