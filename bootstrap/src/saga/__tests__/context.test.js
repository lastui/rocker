import { watchRefresh, watchFetchContext, refreshContext, fetchContext } from "../context";
import { constants } from "@lastui/rocker/platform";

describe("context", () => {
  describe("watchRefresh", () => {
    it("should be defined", () => {
      expect(watchRefresh).toBeDefined();
    });

    it("should fork refreshContext", () => {
      const gen = watchRefresh({ type: constants.REFRESH });
      const step = gen.next();

      expect(step.done).toEqual(false);
      expect(step.value.type).toEqual("FORK");
      expect(step.value.payload.args[0]).toEqual(constants.REFRESH);
      expect(step.value.payload.args[1]).toEqual(refreshContext);
    });
  });

  describe("refreshContext", () => {
    it("should be defined", () => {
      expect(refreshContext).toBeDefined();
    });

    it("should put FETCH_CONTEXT", () => {
      const gen = refreshContext();
      const step = gen.next();

      expect(step.done).toEqual(false);
      expect(step.value.type).toEqual("PUT");
      expect(step.value.payload.action.type).toEqual(constants.FETCH_CONTEXT);

      expect(gen.next().done).toEqual(true);
    });
  });

  describe("watchFetchContext", () => {
    it("should be defined", () => {
      expect(watchFetchContext).toBeDefined();
    });

    it("should fork fetchContext", () => {
      const gen = watchFetchContext({ type: constants.FETCH_CONTEXT });
      const step = gen.next();

      expect(step.done).toEqual(false);
      expect(step.value.type).toEqual("FORK");
      expect(step.value.payload.args[0]).toEqual(constants.FETCH_CONTEXT);
      expect(step.value.payload.args[1]).toEqual(fetchContext);
    });
  });

  describe("fetchContext", () => {
    const consoleWarn = console.warn;

    beforeEach(() => {
      console.warn = jest.fn();
    });

    afterAll(() => {
      console.warn = consoleWarn;
    });

    it("should be defined", () => {
      expect(fetchContext).toBeDefined();
    });

    it("happy path", () => {
      const fetchContextFuture = jest.fn();
      const ctx = {
        entrypoint: "my-entrypoint",
        environment: {
          cloud: false,
        },
        available: [],
      };

      const gen = fetchContext();

      const stepSagaContext = gen.next();

      expect(stepSagaContext.done).toEqual(false);
      expect(stepSagaContext.value.payload).toEqual("fetchContext");

      const stepFetchContext = gen.next(fetchContextFuture);

      expect(stepFetchContext.done).toEqual(false);
      expect(stepFetchContext.value.type).toEqual("CALL");
      expect(stepFetchContext.value.payload.fn).toEqual(fetchContextFuture);

      const stepAvailableModules = gen.next(ctx);

      expect(stepAvailableModules.done).toEqual(false);
      expect(stepAvailableModules.value.payload.action.type).toEqual(constants.SET_AVAILABLE_MODULES);
      expect(stepAvailableModules.value.payload.action.payload.modules).toEqual(ctx.available);

      const stepSetShared = gen.next();

      expect(stepSetShared.done).toEqual(false);
      expect(stepSetShared.value.payload.action.type).toEqual(constants.SET_SHARED);
      expect(stepSetShared.value.payload.action.payload.data).toEqual(ctx.environment);
      expect(stepSetShared.value.payload.action.payload.module).not.toBeDefined();

      const stepEntrypointModule = gen.next();

      expect(stepEntrypointModule.done).toEqual(false);
      expect(stepEntrypointModule.value.payload.action.type).toEqual(constants.SET_ENTRYPOINT_MODULE);
      expect(stepEntrypointModule.value.payload.action.payload.entrypoint).toEqual(ctx.entrypoint);
    });

    it("error path", () => {
      const error = new Error("fail");

      const gen = fetchContext();
      const stepSagaContext = gen.next();

      expect(stepSagaContext.done).toEqual(false);
      expect(stepSagaContext.value.payload).toEqual("fetchContext");

      const stepFetchContext = gen.throw(error);

      expect(stepFetchContext.done).toEqual(true);
      expect(console.warn).toHaveBeenCalledWith("failed to obtain context", error);
    });
  });
});