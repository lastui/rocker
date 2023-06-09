import configureStore from "redux-mock-store";

import createDynamicMiddleware, { injectMiddleware, ejectMiddleware } from "../dynamic";

describe("dynamic middleware", () => {
  afterEach(() => {
    ejectMiddleware("test");
  });

  describe("createDynamicMiddleware", () => {
    it("is function", () => {
      expect(typeof createDynamicMiddleware).toEqual("function");
    });
  });

  describe("injectMiddleware", () => {
    it("truthy middleware", async () => {
      const store = configureStore([createDynamicMiddleware()])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
    });

    it("falsey middleware", async () => {
      const store = configureStore([createDynamicMiddleware()])({});
      await injectMiddleware("test", () => false);
    });

    it("async middleware", async () => {
      const store = configureStore([createDynamicMiddleware()])({});
      await injectMiddleware("test", async () => (localStore) => (next) => (action) => next(action));
    });

    it("replace middleware", async () => {
      const store = configureStore([createDynamicMiddleware()])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
    });
  });

  describe("ejectMiddleware", () => {
    it("when exists", async () => {
      const store = configureStore([createDynamicMiddleware()])({});
      await injectMiddleware("test", () => (localStore) => (next) => (action) => next(action));
      ejectMiddleware("test");
    });

    it("when does not exist", () => {
      const store = configureStore([createDynamicMiddleware()])({});
      ejectMiddleware("test");
    });
  });

  it("enables to dynamically inject and eject middlewares", async () => {
    const store = configureStore([createDynamicMiddleware()])({});

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

    const store = configureStore([createDynamicMiddleware()])({});

    const action = { type: "probe" };

    await injectMiddleware("test", () => (localStore) => (next) => (action) => {
      throw new Error("ouch");
    });

    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);

    expect(spy).toHaveBeenCalledWith("dynamic middleware errored", new Error("ouch"));
  });
});
