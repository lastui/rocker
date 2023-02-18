function removeStyles(name) {
  const orphanStyles = document.querySelector(`style[data-module="${name}"]`);
  if (!orphanStyles) {
    return;
  }
  console.debug(`module ${name} removing styles`);
  orphanStyles.remove();
}

async function addStyles(name, BUILD_ID) {
  const injectedStyles = document.querySelector(`style#rocker-${BUILD_ID}:last-of-type`);
  if (!injectedStyles) {
    return;
  }
  console.debug(`module ${name} introducing styles`);
  injectedStyles.removeAttribute("id");
  injectedStyles.setAttribute("data-module", name);
}

export { addStyles, removeStyles };