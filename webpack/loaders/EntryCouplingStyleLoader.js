function loader(content) {
  return content;
}

loader.pitch = function pitch(request) {
  const options = this.getOptions();

  let max = 0;
  let candidate = null;

  const file = request.slice(request.lastIndexOf("!") + 1);

  for (const entry of this._compilation.entries) {
    let idx = 0;

    for (const entryFile of entry[1].dependencies) {
      while (entryFile.request[idx] === file[idx]) {
        idx++;
      }
    }

    if (idx > max) {
      max = idx;
      candidate = entry;
    }
  }

  if (!candidate) {
    return "";
  }

  const guid = `rocker-${options.getID(candidate[0])}`;

  return `
const id = '${guid}';
const css = require(${JSON.stringify(this.utils.contextify(this.context, `!!${request}`))});
const cssNode = document.createTextNode((css.__esModule ? css.default : css)[0][1]);
let styleNode = document.querySelector('head > style#' + id);
if (!styleNode) {
  styleNode = document.createElement('style');
  styleNode.setAttribute('id', id);
  if (__webpack_nonce__) {
    styleNode.setAttribute('nonce', __webpack_nonce__);
  }
  styleNode.appendChild(cssNode);
  document.head.appendChild(styleNode);
} else {
  styleNode.appendChild(cssNode);
}
  `;
};

module.exports = loader;
