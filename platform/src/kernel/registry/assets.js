import { CANCEL } from "redux-saga";

import { warning } from "../../utils";

const CLIENT_TIMEOUT = 30 * 1000;

export class SequentialProgramEvaluator {
  static queue = [];
  static compiling = false;

  static compile(name, data) {
    return new Promise((resolve) => {
      this.queue.push({
        data,
        name,
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
      if (!(item.data.startsWith("!function") || item.data.startsWith("/*"))) {
        throw new Error(`Asset is not a module`);
      }
      new Function("", item.data)({});
    } catch (error) {
      warning(`module ${item.name} failed to adapt`);
      sandbox.__SANDBOX_SCOPE__.component = () => {
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

/* istanbul ignore next */
async function clientCache(name) {
  try {
    return await window.caches.open(`rocker/${name}`);
  } catch (_err) {
    return {
      async match() {
        return null;
      },
      delete() {},
      put() {},
    };
  }
}

function downloadAsset(resource, parentController) {
  const fetchController = new AbortController();
  const id = setTimeout(() => {
    const error = new Error("Client timeout.");
    error.name = "AbortError";
    fetchController.abort(error);
  }, CLIENT_TIMEOUT);

  if (parentController) {
    function parentAbort() {
      clearTimeout(id);
      parentController.signal.removeEventListener("abort", parentAbort);
      fetchController.abort(parentController.signal.reason);
    }
    parentController.signal.addEventListener("abort", parentAbort);
    /* istanbul ignore next */
    if (parentController.signal.aborted) {
      parentAbort();
    }
  }

  const aborter = new Promise((resolve, reject) => {
    function timeoutAbort() {
      fetchController.signal.removeEventListener("abort", timeoutAbort);
      reject(fetchController.signal.reason);
    }
    fetchController.signal.addEventListener("abort", timeoutAbort);
    /* istanbul ignore next */
    if (fetchController.signal.aborted) {
      timeoutAbort();
    }
  });

  async function fetcher() {
    const etags = await clientCache("etags");
    const etagEntry = await etags.match(resource);
    /* istanbul ignore next */
    const currentEtag = etagEntry ? await etagEntry.clone().text() : null;

    const options = {
      signal: fetchController.signal,
      referrerPolicy: "no-referrer",
      cache: "no-cache",
      mode: "cors",
      credentials: "same-origin",
      headers: new Headers(),
    };

    /* istanbul ignore next */
    if (currentEtag) {
      options.headers.set("If-None-Match", currentEtag);
    }
    const response = await fetch(resource, options);
    clearTimeout(id);

    const resources = await clientCache("assets");

    /* istanbul ignore next */
    if (response.status === 304) {
      if (currentEtag) {
        const assetEntry = await resources.match(`${resource}_${currentEtag}`);
        if (assetEntry) {
          return assetEntry.clone();
        }
        resources.delete(`${resource}_${currentEtag}`);
      }
      etags.delete(resource);
      const bounced = await work();
      return bounced;
    }

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    /* istanbul ignore next */
    if (currentEtag) {
      etags.delete(resource);
      resources.delete(`${resource}_${currentEtag}`);
    }
    const latestEtag = response.headers.get("Etag");
    /* istanbul ignore next */
    if (latestEtag) {
      resources.put(`${resource}_${latestEtag}`, response.clone());
      etags.put(resource, new Response(latestEtag, { status: 200, statusText: "OK" }));
    }
    return response;
  }

  const request = Promise.race([aborter, fetcher()]).catch((error) => {
    clearTimeout(id);
    return Promise.reject(error);
  });

  request[CANCEL] = () => {
    clearTimeout(id);
    const error = new Error("Saga canceled.");
    error.name = "AbortError";
    fetchController.abort(error);
  };

  return request;
}

async function downloadProgram(name, program, controller) {
  if (!program) {
    return {};
  }
  const data = await downloadAsset(program.url, controller);
  const content = await data.text();
  return SequentialProgramEvaluator.compile(name, content);
}

export { downloadAsset, downloadProgram };
