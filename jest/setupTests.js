global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("@linaria/react", () => {
  function styled(tag) {
    return jest.fn(() => tag);
  }
  return {
    styled: new Proxy(styled, {
      get(ref, prop) {
        return ref(prop);
      },
    }),
  };
});

jest.mock("@linaria/core", () => ({
  css: jest.fn(() => ""),
}));

if (!globalThis.fetch) {
  globalThis.fetch = jest.fn();
  globalThis.Request = jest.fn();
  globalThis.Response = jest.fn();
}

if (!globalThis.AbortController) {
  globalThis.AbortController = jest.fn();
}

if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
  globalThis.TextEncoder = jest.fn();
  globalThis.TextDecoder = jest.fn();
}
