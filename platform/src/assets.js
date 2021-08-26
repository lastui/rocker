const CLIENT_TIMEOUT = 30 * 1000;

async function download(resource, options) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), CLIENT_TIMEOUT);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  return response;
}

const downloadJson = (uri) => download(uri, {}).then((data) => data.json());

const downloadProgram = (uri, sha256) =>
  download(uri, {
    integrity: sha256 ? `sha256-${sha256}` : undefined,
  })
    .then((data) => data.text())
    .then((data) => {
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
