import { watchBootstrap, runRefresher } from "../bootstrap";
import { constants } from "@lastui/rocker/platform";

describe("context", () => {
  const consoleDebug = console.warn;
  const consoleWarn = console.warn;

  beforeEach(() => {
    console.debug = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.debug = consoleDebug;
    console.warn = consoleWarn;
  });

  describe("watchBootstrap", () => {
    it("should be defined", () => {
      expect(watchBootstrap).toBeDefined();
    });

    it("should fork runRefresher", () => {
      const gen = watchBootstrap({ type: constants.INIT });
      const step = gen.next();

      expect(step.done).toEqual(false);
      expect(step.value.type).toEqual("FORK");
      expect(step.value.payload.args[0]).toEqual(constants.INIT);
      expect(step.value.payload.args[1]).toEqual(runRefresher);
    });
  });

  describe("runRefresher", () => {
    it("single run", async () => {
      const ctx = {
        entrypoint: "my-entrypoint",
        available: [],
      };
      const action = {
        type: constants.INIT,
        payload: {},
      };

      const gen = runRefresher(action);
      const stepFetch = gen.next();

      expect(stepFetch.done).toEqual(false);
      expect(stepFetch.value.type).toEqual("PUT");
      expect(stepFetch.value.payload.action.type).toEqual(constants.FETCH_CONTEXT);

      const waitingStep = gen.next();

      expect(waitingStep.done).toEqual(true);
    });

    it("continuous polling delay", async () => {
      const ctx = {
        entrypoint: "my-entrypoint",
        available: [],
      };
      const action = {
        type: constants.INIT,
        payload: {
          contextRefreshInterval: 10,
        },
      };

      const gen = runRefresher(action);
      const stepFetch = gen.next();

      expect(stepFetch.done).toEqual(false);
      expect(stepFetch.value.type).toEqual("PUT");
      expect(stepFetch.value.payload.action.type).toEqual(constants.FETCH_CONTEXT);

      const waitingStep = gen.next();

      expect(waitingStep.done).toEqual(false);
      expect(waitingStep.value.type).toEqual("RACE");

      const stepNextCycle = gen.next({
        refresh: false,
        timeout: true,
      });

      expect(stepNextCycle.done).toEqual(false);
      expect(stepNextCycle.value.type).toEqual("PUT");
      expect(stepNextCycle.value.payload.action.type).toEqual(constants.FETCH_CONTEXT);
    });

    it("continuous polling interupt", async () => {
      const ctx = {
        entrypoint: "my-entrypoint",
        available: [],
      };
      const action = {
        type: constants.INIT,
        payload: {
          contextRefreshInterval: 10,
        },
      };

      const gen = runRefresher(action);
      const stepFetch = gen.next();

      expect(stepFetch.done).toEqual(false);
      expect(stepFetch.value.type).toEqual("PUT");
      expect(stepFetch.value.payload.action.type).toEqual(constants.FETCH_CONTEXT);

      const waitingStep = gen.next();

      expect(waitingStep.done).toEqual(false);
      expect(waitingStep.value.type).toEqual("RACE");

      const stepNextCycle = gen.next({
        refresh: true,
        timeout: false,
      });

      expect(stepNextCycle.done).toEqual(false);
      expect(stepNextCycle.value.type).toEqual("RACE");
    });
  });
});