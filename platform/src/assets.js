
const CLIENT_TIMEOUT = 30 * 1000;

async function download(resource, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), CLIENT_TIMEOUT);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  if (!response.ok) {
    throw new Error(String(response.status))
  }
  return response;
}

export {
	download,
}