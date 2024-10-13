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
    /* c8 ignore next 3 */
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
      top.__SANDBOX_SCOPE__ = sandbox.__SANDBOX_SCOPE__;

      new Function("", item.data)({});
    } catch (error) {
      if (!(item.data.startsWith("!") || item.data.startsWith("/*"))) {
        warning(`asset for module ${item.name} is not a module`);
      } else {
        warning(`module ${item.name} failed to adapt`);
      }
      sandbox.__SANDBOX_SCOPE__.component = () => {
        throw error;
      };
    } finally {
      delete top.__SANDBOX_SCOPE__;
    }
    item.resolve(sandbox.__SANDBOX_SCOPE__);
    this.compiling = false;
    this.tick();
    return;
  }
}

async function clientCache(name) {
  try {
    return await top.caches.open(`rocker/${name}`);
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
    /* c8 ignore next 3 */
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
    /* c8 ignore next 3 */
    if (fetchController.signal.aborted) {
      timeoutAbort();
    }
  });

  async function fetcher() {
    const etags = await clientCache("etags");
    const etagEntry = await etags.match(resource);
    /* c8 ignore next 1 */
    const currentEtag = etagEntry ? await etagEntry.clone().text() : null;

    const options = {
      signal: fetchController.signal,
      referrerPolicy: "no-referrer",
      cache: "no-cache",
      mode: "cors",
      credentials: "same-origin",
      headers: new Headers(),
    };

    /* c8 ignore next 3 */
    if (currentEtag) {
      options.headers.set("If-None-Match", currentEtag);
    }

    const response = await fetch(resource, options);
    const resources = await clientCache("assets");

    /* c8 ignore next 16 */
    if (response.status === 304) {
      if (currentEtag) {
        try {
          const assetEntry = await resources.match(`${resource}_${currentEtag}`);
          if (assetEntry) {
            return assetEntry.clone();
          }
        } catch (_error) {
          /* silence the cache error */
        }
        resources.delete(`${resource}_${currentEtag}`);
      }
      etags.delete(resource);
      const bounced = await fetcher();
      return bounced;
    }

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    /* c8 ignore next 4 */
    if (currentEtag) {
      etags.delete(resource);
      resources.delete(`${resource}_${currentEtag}`);
    }

    const latestEtag = response.headers.get("Etag");
    const blob = await response.blob();
    const cleaned = new Response(blob, { status: 200, statusText: "OK" });
    
    /* c8 ignore next 4 */
    if (latestEtag) {
      resources.put(`${resource}_${latestEtag}`, cleaned.clone());
      etags.put(resource, new Response(latestEtag, { status: 200, statusText: "OK" }));
    }

    return cleaned;
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
