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

/* istanbul ignore next */
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
    const resources = await clientCache("assets");

    /* istanbul ignore next */
    if (response.status === 304) {
      if (currentEtag) {
        try {
          const assetEntry = await resources.match(`${resource}_${currentEtag}`);
          if (assetEntry) {
            return assetEntry.clone();
          }
        } catch (error) {
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

    /* istanbul ignore next */
    if (currentEtag) {
      etags.delete(resource);
      resources.delete(`${resource}_${currentEtag}`);
    }
    const latestEtag = response.headers.get("Etag");
    const blob = await response.blob();
    const cleaned = new Response(blob, { status: 200, statusText: "OK" });
    /* istanbul ignore next */
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

  const pre = top.document.createElement('script');
  pre.innerHTML = `
self.lastuiJsonp = top.lastuiJsonp;
self.onerror = function(_message, _file, _line, _col, error) {
  self.__SANDBOX_SCOPE__ = {
    component() {
      throw error;
    },
  };
  return false;
}`;

  for (const dll in top) {
    if (dll.startsWith('rocker_so')) {
      pre.innerHTML += `
self.${dll} = top.${dll};`;
    }
  }

  const script = top.document.createElement('script');

  script.src = program.url;
  script.async = false;

  const post = top.document.createElement('script');
  post.innerHTML = 'self.__SANDBOX_SCOPE__ = {};';

  const iframe = top.document.createElement('iframe');

  // INFO yields "An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing."
  //iframe.sandbox = 'allow-same-origin allow-scripts';

  const trap = {};

  try {

    iframe.src = "about:blank";

    //iframe.srcdoc = bootstrap.outerHTML + script.outerHTML;

    top.document.head.appendChild(iframe);
    
    iframe.contentDocument.head.appendChild(pre);
    iframe.contentDocument.head.appendChild(script);
    iframe.contentDocument.head.appendChild(post);

    // INFO handling errors plus timeout CLIENT_TIMEOUT
    await new Promise((resolve, reject) => {
      let wasSet = false;
      Object.defineProperty(iframe.contentWindow, "__SANDBOX_SCOPE__", {
        set(value) {
          if (wasSet) {
            return false;
          }
          console.log('frame called set on __SANDBOX_SCOPE__', value);
          Object.assign(trap, value);
          resolve();
          return true;
        },
        get() {
          return trap;
        }
      });
    });
  } catch (error) {
    console.log('frame error', error);
  } finally {
    top.document.head.removeChild(iframe);
  }

  console.log('Downloaded program', program);

  console.log('Result is', trap)

  return trap;

  //const data = await downloadAsset(program.url, controller);
  //const content = await data.text();
  //return SequentialProgramEvaluator.compile(name, content);
}

export { downloadAsset, downloadProgram };
