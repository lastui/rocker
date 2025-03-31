import { put, call } from "redux-saga/effects";

import { constants } from "@lastui/rocker/platform";

import { watchRefresh, watchFetchContext, refreshContext, fetchContext } from "../context";

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

      expect(gen.next().value).toEqual(put({ type: constants.FETCH_CONTEXT }));
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

      expect(gen.next().value.payload).toEqual("fetchContext");
      expect(gen.next(fetchContextFuture).value).toEqual(call(fetchContextFuture));
      expect(gen.next(ctx).value).toEqual(put({ type: constants.SET_AVAILABLE_MODULES, payload: { modules: ctx.available } }));
      expect(gen.next().value).toEqual(put({ type: constants.SET_SHARED, payload: { data: ctx.environment } }));
      expect(gen.next().value).toEqual(put({ type: constants.SET_ENTRYPOINT_MODULE, payload: { entrypoint: ctx.entrypoint } }));
    });

    it("error path", () => {
      const spyError = jest.spyOn(console, "error");
      spyError.mockImplementation(() => {});

      const error = new Error("fail");

      const gen = fetchContext();
      expect(gen.next().value.payload).toEqual("fetchContext");
      expect(gen.throw(error).done).toEqual(true);

      expect(spyError).toHaveBeenCalledWith("failed to obtain context", error);
    });
  });
});
