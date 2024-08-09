function removeStyles(name) {
  const orphanStyles = document.querySelector(`style[data-module="${name}"]`);
  if (!orphanStyles) {
    return;
  }
  orphanStyles.remove();
}

async function addStyles(name, BUILD_ID) {
  const injectedStyles = document.querySelector(`style#rocker-${BUILD_ID}:last-of-type`);
  if (!injectedStyles) {
    return;
  }
  injectedStyles.removeAttribute("id");
  injectedStyles.setAttribute("data-module", name);
}

export { addStyles, removeStyles };
