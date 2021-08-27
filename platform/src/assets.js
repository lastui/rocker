import sha256 from 'node-forge/lib/sha256';

const CLIENT_TIMEOUT = 30 * 1000;

async function download(resource) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), CLIENT_TIMEOUT);
  const response = await fetch(resource, {
    signal: controller.signal,
  });
  clearTimeout(id);
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return response;
}

const downloadJson = (uri) => download(uri).then((data) => data.json());

const downloadProgram = (program) =>
  download(program.url)
    .then((data) => data.text())
    .then((data) => {
      if (program.sha256) {
        const md = forge.md.sha256.create();
        md.update(data);
        const digest = md.digest().toHex();
        if (digest !== program.sha256) {
          return {
            Main: () => {
              throw new Error('integrity check failed');
            },
          };
        }
      }
      let sandbox = {
        __SANDBOX_SCOPE__: {},
      };
      try {
        const r = new Function("with(this) {" + data + ";}").call(sandbox);
        if (r !== undefined) {
          return {};
        }
      } catch (err) {
        return {
          Main: () => {
            throw err;
          },
        };
      }
      return sandbox.__SANDBOX_SCOPE__;
    });

export { downloadJson, downloadProgram };
