import { CANCEL } from "redux-saga";

import { warning } from "../../utils";

const CLIENT_TIMEOUT = 30 * 1000;

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

  console.log('Downloading program', program);

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

    console.log('Waiting for program', program);

    const callback = function(resolve, _reject) {
      let wasSet = false;

      console.log('defining  __SANDBOX_SCOPE__ property for program', program, 'in scope', this);

      // INFO for some reason this property is always defined on a firstly inserted iframe
      // maybe hoisting?
      Object.defineProperty(this, "__SANDBOX_SCOPE__", {
        set(value) {
          console.log('frame called set on __SANDBOX_SCOPE__', value, 'for program', program, 'wasSet', wasSet);
          if (wasSet) {
            return false;
          }
          Object.assign(trap, value);
          resolve();
          return true;
        },
        get() {
          return trap;
        }
      });
    }.bind(iframe.contentWindow); // INFO browser possibly recycles frame window references

    await new Promise(callback);
    console.log('Done for program', program);

    // INFO now need to move implicitely injected styles from frame into main frame
  } catch (error) {
    console.log('frame error', error);
  } finally {
    top.document.head.removeChild(iframe);
  }

  console.log('Downloaded program', program);

  console.log('Result is', trap)

  return trap;
}

export { downloadAsset, downloadProgram };
