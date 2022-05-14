import { CANCEL } from "redux-saga";

import { warning } from "../../utils";

const CLIENT_TIMEOUT = 30 * 1000;

export class SequentialProgramEvaluator {
  static queue = [];
  static compiling = false;

  static compile(id, data) {
    return new Promise((resolve) => {
      this.queue.push({
        data,
        id,
        resolve,
      });
      this.tick();
    });
  }

  static tick() {
    /* istanbul ignore next */
    if (this.compiling) {
      return;
    }
    const item = this.queue.shift();
    if (!item) {
      this.compiling = false;
      return;
    }
    this.compiling = true;
    const sandbox = {
      __SANDBOX_SCOPE__: {},
    };
    try {
      window.__SANDBOX_SCOPE__ = sandbox.__SANDBOX_SCOPE__;
      new Function("", item.data)({});
    } catch (error) {
      warning(`module ${item.id} failed to adapt with error`, error);
      sandbox.__SANDBOX_SCOPE__.Main = () => {
        throw error;
      };
    } finally {
      delete window.__SANDBOX_SCOPE__;
    }
    item.resolve(sandbox.__SANDBOX_SCOPE__);
    this.compiling = false;
    this.tick();
    return;
  }
}

function downloadAsset(resource) {
  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, CLIENT_TIMEOUT);
  const request = new Promise((resolve, reject) => {
    const options = {
      signal: controller.signal,
      referrerPolicy: "no-referrer",
      cache: "no-cache",
    };
    fetch(resource, options)
      .then((response) => {
        clearTimeout(id);
        if (!response.ok) {
          return reject(new Error(String(response.status)));
        }
        return resolve(response);
      })
      .catch((error) => {
        clearTimeout(id);
        return reject(error);
      });
  });
  request[CANCEL] = () => {
    clearTimeout(id);
    controller.abort();
  };
  return request;
}

async function downloadProgram(id, program) {
  if (!program) {
    return {};
  }
  const data = await downloadAsset(program.url);
  const content = await data.text();
  return SequentialProgramEvaluator.compile(id, content);
}

export { downloadAsset, downloadProgram };