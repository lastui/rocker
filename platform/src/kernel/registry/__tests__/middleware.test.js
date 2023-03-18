import { addMiddleware, removeMiddleware } from "../middleware";

jest.mock("../../middleware/dynamic", () => {
  const memo = {};

  const injectMiddleware = jest.fn();
  injectMiddleware.mockImplementation((name, middleware) => {
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
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
  });

  it("addMiddleware", async () => {
    await addMiddleware("my-feature", () => (store) => (next) => (action) => next(action));
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature introducing middleware");

    await addMiddleware("my-feature", () => (store) => (next) => (action) => next(action));
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature replacing middleware");
  });

  it("removeMiddleware", async () => {
    await addMiddleware("my-feature", () => (store) => (next) => (action) => next(action));

    removeMiddleware("my-feature");

    expect(debugSpy).toHaveBeenCalledWith("module my-feature removing middleware");
    debugSpy.mockClear();

    removeMiddleware("my-feature");

    expect(debugSpy).not.toHaveBeenCalled();
  });
});
