import sha256 from "node-forge/lib/sha256";

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

async function downloadProgram(program) {
  const data = await download(program.url);
  const content = await data.text();
  if (program.sha256) {
    const md = sha256.create();
    md.update(data, "utf8");
    const digest = md.digest().toHex();
    if (digest !== program.sha256) {
      return {
        Main: () => {
          throw new Error("integrity check failed");
        },
      };
    }
  }
  return SequentialProgramEvaluator.compile(data);
}

export { downloadJson, downloadProgram };
