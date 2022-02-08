const CLIENT_TIMEOUT = 30 * 1000;

class SequentialProgramEvaluator {
  static queue = [];
  static compiling = false;

  static compile(data) {
    return new Promise((resolve) => {
      this.queue.push({
        data,
        resolve,
      });
      this.tick();
    });
  }

  static tick() {
    if (this.compiling) {
      return;
    }
    if (this.queue.length === 0) {
      this.compiling = false;
      return;
    }
    this.compiling = true;
    const item = this.queue.shift();
    if (!item) {
      this.compiling = false;
      this.tick();
      return;
    }
    let sandbox = {
      __SANDBOX_SCOPE__: {},
    };
    try {
      window.__SANDBOX_SCOPE__ = sandbox.__SANDBOX_SCOPE__;
      new Function("", item.data)();
    } catch (err) {
      sandbox.__SANDBOX_SCOPE__.Main = () => {
        throw err;
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

async function download(resource) {
  const controller = new AbortController();
  const id = setTimeout(controller.abort, CLIENT_TIMEOUT);
  try {
    const response = await fetch(resource, {
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function downloadJson(uri) {
  const data = await download(uri);
  const content = await data.json();
  return content;
};

async function checkDigest(payload, digest) {
  if (digest === undefined) {
    return true
  }
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hex === digest;
  } catch(_err) {
    return true;
  }
};

async function downloadProgram(program) {
  const data = await download(program.url);
  const content = await data.text();
  if (!checkDigest(content, program.sha256)) {
    return {
      Main: () => {
        throw new Error(`integrity check or ${program.url} failed`);
      },
    };
  }
  return SequentialProgramEvaluator.compile(content);
}

export { downloadJson, downloadProgram };
