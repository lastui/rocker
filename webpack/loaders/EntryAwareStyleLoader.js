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

  const guid = `rocker-${options.getEntryCouplingID(candidate[0])}`;

  return `
    let css = require(${JSON.stringify(this.utils.contextify(this.context, `!!${request}`))});
    css = css.__esModule ? css.default : css;

    const cssNode = document.createTextNode(css[0][1]);

    let styleNode = document.querySelector('head > style#${guid}');

    if (!styleNode) {
      styleNode = document.createElement('style');
      styleNode.setAttribute('id', '${guid}');
      styleNode.appendChild(cssNode);
      document.head.appendChild(styleNode);
    } else {
      styleNode.appendChild(cssNode);
    }
  `;
};

module.exports = loader;
