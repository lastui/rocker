function removeStyles(id) {
  const orphanStyles = document.querySelector(`[data-module=${id}`);
  if (!orphanStyles) {
    return;
  }
  console.debug(`module ${id} removing styles`);
  orphanStyles.remove();
}

async function addStyles(id, BUILD_ID) {
  const injectedStyles = document.querySelector(`style#rocker-${BUILD_ID}:last-of-type`);
  if (!injectedStyles) {
    return;
  }
  console.debug(`module ${id} introducing styles`);
  injectedStyles.removeAttribute("id");
  injectedStyles.setAttribute("data-module", id);
}

export { addStyles, removeStyles };