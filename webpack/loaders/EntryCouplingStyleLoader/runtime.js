/* global BUILD_ID, __webpack_nonce__ */
module.exports = function (css, id) {
  const couplingID = "rocker-" + BUILD_ID + "-" + id;
  const cssNode = document.createTextNode((css.__esModule ? css.default : css)[0][1]);
  let styleNode = document.querySelector("head > style#" + couplingID);
  if (!styleNode) {
    styleNode = document.createElement("style");
    styleNode.setAttribute("id", couplingID);
    const nonce = typeof __webpack_nonce__ !== "undefined" ? __webpack_nonce__ : null;
    if (nonce) {
      styleNode.setAttribute("nonce", nonce);
    }
    styleNode.appendChild(cssNode);
    document.head.appendChild(styleNode);
  } else {
    styleNode.appendChild(cssNode);
  }
};
