import { put, race, take, delay } from "redux-saga/effects";

import { constants } from "@lastui/rocker/platform";

import { watchBootstrap, runRefresher } from "../bootstrap";

describe("context", () => {
  const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
  });

  afterAll(() => {
    debugSpy.mockRestore();
  });

  describe("watchBootstrap", () => {
    it("should be defined", () => {
      expect(watchBootstrap).toBeDefined();
    });

    it("should fork runRefresher", () => {
      const gen = watchBootstrap();
      const step = gen.next();

      expect(step.done).toEqual(false);
      expect(step.value.type).toEqual("FORK");
      expect(step.value.payload.args[0]).toEqual(constants.INIT);
      expect(step.value.payload.args[1]).toEqual(runRefresher);
    });
  });

  describe("runRefresher", () => {
    it("single run", () => {
      const gen = runRefresher({
        type: constants.INIT,
        payload: {},
      });

      expect(gen.next().value).toEqual(put({ type: constants.FETCH_CONTEXT }));
      expect(gen.next().done).toEqual(true);
    });

    it("continuous polling delay", () => {
      const gen = runRefresher({
        type: constants.INIT,
        payload: {
          contextRefreshInterval: 10,
        },
      });

      expect(gen.next().value).toEqual(put({ type: constants.FETCH_CONTEXT }));
      expect(gen.next().value).toEqual(race({ refresh: take(constants.REFRESH), timeout: delay(10) }));
      expect(gen.next({ refresh: false, timeout: true }).value).toEqual(put({ type: constants.FETCH_CONTEXT }));
    });

    it("continuous polling interupt", () => {
      const gen = runRefresher({
        type: constants.INIT,
        payload: {
          contextRefreshInterval: 10,
        },
      });

      expect(gen.next().value).toEqual(put({ type: constants.FETCH_CONTEXT }));
      expect(gen.next().value).toEqual(race({ refresh: take(constants.REFRESH), timeout: delay(10) }));
      expect(gen.next({ refresh: true, timeout: false }).value).toEqual(
        race({ refresh: take(constants.REFRESH), timeout: delay(10) }),
      );
    });
  });
});
