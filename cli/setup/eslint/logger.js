const path = require("path");
const colors = require("ansi-colors");

const durations = {};

const processor = {
  preprocess: (text, filename) => {
    durations[filename] = performance.now();
    return [text];
  },
  postprocess: ([messages = []] = [], filename) => {
    const duration = Math.round(performance.now() - durations[filename]);
    const notice = path.relative(process.env.INIT_CWD, filename);
    if (messages.length === 0) {
      console.log(colors.gray(`✔︎ ${notice}`), `${duration}ms`);
    } else if (messages.some((item) => item.severity > 1)) {
      console.log(colors.red(`✘ ${notice}`), `${duration}ms`);
    } else {
      console.log(colors.yellow(`▲ ${notice}`), `${duration}ms`);
    }
    return messages;
  },
  supportsAutofix: true,
};

module.exports = {
  processors: {
    ".js": processor,
    ".jsx": processor,
    ".ts": processor,
    ".tsx": processor,
  },
};
