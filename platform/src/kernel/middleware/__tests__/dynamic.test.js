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
      await injectMiddleware("test", () => (_localStore) => (next) => (action) => next(action));
    });

    it("falsey middleware", async () => {
      await injectMiddleware("test", () => false);
    });

    it("async middleware", async () => {
      await injectMiddleware("test", async () => (_localStore) => (next) => (action) => next(action));
    });

    it("replace middleware", async () => {
      await injectMiddleware("test", () => (_localStore) => (next) => (action) => next(action));
      await injectMiddleware("test", () => (_localStore) => (next) => (action) => next(action));
    });
  });

  describe("ejectMiddleware", () => {
    it("when exists", async () => {
      await injectMiddleware("test", () => (_localStore) => (next) => (action) => next(action));
      ejectMiddleware("test");
    });

    it("when does not exist", () => {
      ejectMiddleware("test");
    });
  });

  it("enables to dynamically inject and eject middlewares", async () => {
    const store = configureStore([createDynamicMiddleware()])({});

    const action = { type: "probe" };
    const middlewareAction = { type: "mw-probe" };

    await injectMiddleware("test", () => (_localStore) => (next) => (action) => {
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

    await injectMiddleware("test", () => (_localStore) => (_next) => (_action) => {
      throw new Error("ouch");
    });

    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);

    expect(spy).toHaveBeenCalledWith("dynamic middleware errored", new Error("ouch"));
  });
});
