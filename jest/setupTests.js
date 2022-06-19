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