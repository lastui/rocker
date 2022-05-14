import configureStore from "redux-mock-store";

import dynamicMiddlewares, { injectMiddleware, ejectMiddleware } from "../dynamic";

describe("dynamic middleware", () => {
  afterEach(() => {
    ejectMiddleware("test");
  });

  describe("dynamicMiddlewares", () => {
    it("is defined", () => {
      // FIXME test if is a middleware
      expect(dynamicMiddlewares).toBeDefined();
    });

    // TODO test if can work as middleware even with no injected middlewares
  });

  describe("injectMiddleware", () => {
    it("truthy middleware", async () => {
      const store = configureStore([dynamicMiddlewares])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
    });

    it("falsey middleware", async () => {
      const store = configureStore([dynamicMiddlewares])({});
      await injectMiddleware("test", () => false);
    });

    it("async middleware", async () => {
      const store = configureStore([dynamicMiddlewares])({});
      await injectMiddleware("test", async () => (localStore) => (next) => (action) => next(action));
    });

    it("replace middleware", async () => {
      const store = configureStore([dynamicMiddlewares])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
    });
  });

  describe("ejectMiddleware", () => {
    it("when exists", async () => {
      const store = configureStore([dynamicMiddlewares])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
      ejectMiddleware("test");
    });

    it("when does not exist", () => {
      const store = configureStore([dynamicMiddlewares])({});
      ejectMiddleware("test");
    });
  });

  it("enables to dynamically inject and eject middlewares", async () => {
    const store = configureStore([dynamicMiddlewares])({});

    const action = { type: "probe" };
    const middlewareAction = { type: "mw-probe" };

    await injectMiddleware("test", () => (localStore) => (next) => (action) => {
      if (action.type === "probe") {
        store.dispatch(middlewareAction);
      }
      return next(action);
    });

    store.dispatch(action);
    expect(store.getActions()).toEqual([middlewareAction, action]);

    store.clearActions();
    ejectMiddleware("test");
    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);
  });

  it("recovers on broken middleware", async () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});
    spy.mockClear();

    const store = configureStore([dynamicMiddlewares])({});

    const action = { type: "probe" };

    await injectMiddleware("test", () => (localStore) => (next) => (action) => {
      throw "ouch";
    });

    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);

    expect(spy).toHaveBeenCalledWith("dynamic middleware errored", "ouch");
  });
});