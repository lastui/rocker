import { addMiddleware, removeMiddleware } from "../middleware";

jest.mock("../../middleware/dynamic", () => {
  const memo = {};

  const injectMiddleware = jest.fn();
  injectMiddleware.mockImplementation((name, _middleware) => {
    memo[name] = true;
    return Promise.resolve(true);
  });

  const ejectMiddleware = jest.fn();
  ejectMiddleware.mockImplementation((name) => {
    if (memo[name]) {
      delete memo[name];
      return true;
    } else {
      return false;
    }
  });

  return {
    injectMiddleware,
    ejectMiddleware,
  };
});

describe("middleware registry", () => {
  it("addMiddleware", async () => {
    await addMiddleware("my-feature", () => (_store) => (next) => (action) => next(action));
    await addMiddleware("my-feature", () => (_store) => (next) => (action) => next(action));
  });

  it("removeMiddleware", async () => {
    await addMiddleware("my-feature", () => (_store) => (next) => (action) => next(action));
    removeMiddleware("my-feature");
    removeMiddleware("my-feature");
  });
});
