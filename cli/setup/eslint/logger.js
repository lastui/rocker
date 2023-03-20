const path = require("path");
const colors = require("ansi-colors");

const durations = {};

const processor = {
  preprocess: (text, filename) => {
    durations[filename] = process.hrtime();
    return [text];
  },
  postprocess: ([messages = []] = [], filename) => {
    const end = process.hrtime(durations[filename]);
    const duration = `${(end[0] * 1_000 + end[1] / 1_000_000).toFixed(2)} ms`;
    const notice = path.relative(process.env.INIT_CWD, filename);
    if (messages.length === 0) {
      console.log(colors.green(`✓`), colors.dim(`${notice} (${duration})`));
    } else if (messages.some((item) => item.severity > 1)) {
      console.log(colors.red(`✕`), colors.dim(`${notice} (${duration})`));
    } else {
      console.log(colors.yellow(`!`), colors.dim(`${notice} (${duration})`));
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
