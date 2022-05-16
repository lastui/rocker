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

  const fetchController = new AbortController();
  const aborter = new Promise((resolve, reject) => {
    controller.signal.onabort = function () {
      fetchController.abort();
      reject("aborted");
    };
  });

  const fetcher = new Promise((resolve, reject) => {
    async function work() {
      const etagKey = `etag:/${resource}`;
      const etag = window.localStorage.getItem(etagKey);

      const options = {
        signal: fetchController.signal,
        referrerPolicy: "no-referrer",
        cache: "no-cache",
        mode: "cors",
        credentials: "same-origin",
        headers: new Headers(),
      };

      /* istanbul ignore next */
      if (etag) {
        options.headers.set("If-None-Match", etag);
      }

      const response = await fetch(resource, options);
      clearTimeout(id);

      const resources = await window.caches.open("assets-cache");

      /* istanbul ignore next */
      if (response.status === 304) {
        if (etag) {
          const cacheEntry = await resources.match(`${resource}_${etag}`);
          if (cacheEntry) {
            return cacheEntry.clone();
          }
          resources.delete(`${resource}/${etag.replaceAll('"', "")}`);
        }
        window.localStorage.removeItem(etagKey);
        const bounced = await downloadAsset(resource);
        return bounced;
      }

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      window.localStorage.removeItem(etagKey);
      /* istanbul ignore next */
      if (etag) {
        resources.delete(`${resource}_${etag}`);
      }
      const responseEtag = response.headers.get("Etag");
      /* istanbul ignore next */
      if (responseEtag) {
        resources.put(`${resource}_${responseEtag}`, response.clone());
        window.localStorage.setItem(etagKey, responseEtag);
      }
      return response;
    }

    work()
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(id);
        reject(error);
      });
  });

  const request = Promise.race([aborter, fetcher]);
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