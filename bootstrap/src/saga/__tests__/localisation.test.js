import { put, call, select } from "redux-saga/effects";

import { constants } from "@lastui/rocker/platform";

import { I18N_ADD_MESSAGES, I18N_REMOVE_MESSAGES } from "../../constants";
import { getLanguage } from "../../selector";
import { watchModules, watchChangeLanguage, downloadBatchLocales } from "../localisation";

describe("localisation", () => {
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

  describe("watchChangeLanguage", () => {
    it("should be defined", () => {
      expect(watchChangeLanguage).toBeDefined();
    });

    describe(`on ${constants.SET_LANGUAGE}`, () => {
      it(`should fetch missing messages and yield ${I18N_ADD_MESSAGES} afterwards`, () => {
        const gen = watchChangeLanguage();

        gen.next();

        const stepDownloadMessages = gen.next({ type: constants.SET_LANGUAGE, payload: { language: "fr-FR" } });

        expect(stepDownloadMessages.done).toEqual(false);
        expect(stepDownloadMessages.value.type).toEqual("CALL");
        expect(stepDownloadMessages.value.payload.args).toEqual([[], "fr-FR"]);

        const stepAddI18n = gen.next(["item"]);

        expect(stepAddI18n.done).toEqual(false);
        expect(stepAddI18n.value.type).toEqual("PUT");
        expect(stepAddI18n.value.payload.action).toEqual({
          type: I18N_ADD_MESSAGES,
          payload: { batch: ["item"], language: "fr-FR" },
        });
      });

      it(`should not load already loaded messages and yield ${I18N_ADD_MESSAGES} afterwards`, () => {
        const gen = watchChangeLanguage();

        gen.next();

        const stepDownloadMessages = gen.next({ type: constants.SET_LANGUAGE, payload: { language: "fr-FR" } });

        expect(stepDownloadMessages.done).toEqual(false);
        expect(stepDownloadMessages.value.type).toEqual("CALL");
        expect(stepDownloadMessages.value.payload.args).toEqual([[], "fr-FR"]);

        const stepAddI18n = gen.next(["item"]);

        expect(stepAddI18n.done).toEqual(false);
        expect(stepAddI18n.value.type).toEqual("PUT");
        expect(stepAddI18n.value.payload.action).toEqual({
          type: I18N_ADD_MESSAGES,
          payload: { batch: ["item"], language: "fr-FR" },
        });
      });
    });
  });

  describe("watchModules", () => {
    it("should be defined", () => {
      expect(watchModules).toBeDefined();
    });

    it(`on ${constants.SET_AVAILABLE_MODULES} should ...`, () => {
      const gen = watchModules();

      gen.next();

      expect(
        gen.next({
          type: constants.SET_AVAILABLE_MODULES,
          payload: {
            modules: [
              {
                name: "my-feature",
              },
              {
                name: "my-other-feature",
                locales: { "fr-FR": "/i18n/broken.json" },
              },
            ],
          },
        }).done,
      ).toEqual(false);
    });

    describe(`on ${constants.MODULE_LOADED}`, () => {
      it("no messages", () => {
        const gen = watchModules();

        gen.next();

        expect(gen.next({ type: constants.MODULE_LOADED, payload: { module: "my-feature" } }).value).toEqual(select(getLanguage));

        expect(gen.next("en-US").value).toEqual(call(downloadBatchLocales, ["my-feature"], "en-US"));

        expect(gen.next([]).value).toEqual(put({ type: constants.MODULE_INIT, payload: { module: "my-feature" } }));

        expect(gen.next().value).toEqual(put({ type: constants.MODULE_READY, payload: { module: "my-feature" } }));

        gen.next({ type: constants.MODULE_UNLOADED, payload: { module: "my-feature" } });
      });

      it("some messages", () => {
        const batch = [
          {
            module: "my-feature",
            data: {
              existing: "new",
              "message.key": "message.value",
              nested: {
                localisation: "value",
              },
            },
          },
        ];

        const gen = watchModules();

        gen.next();

        expect(gen.next({ type: constants.MODULE_LOADED, payload: { module: "my-feature" } }).value).toEqual(select(getLanguage));

        expect(gen.next("en-US").value).toEqual(call(downloadBatchLocales, ["my-feature"], "en-US"));

        expect(gen.next(batch).value).toEqual(put({ type: I18N_ADD_MESSAGES, payload: { language: "en-US", batch } }));

        expect(gen.next().value).toEqual(put({ type: constants.MODULE_INIT, payload: { module: "my-feature" } }));

        expect(gen.next().value).toEqual(put({ type: constants.MODULE_READY, payload: { module: "my-feature" } }));

        gen.next({ type: constants.MODULE_UNLOADED, payload: { module: "my-feature" } });
      });
    });

    it(`on ${constants.MODULE_UNLOADED} should ...`, () => {
      const gen = watchModules();

      gen.next();

      expect(gen.next({ type: constants.MODULE_UNLOADED, payload: { module: "my-feature" } }).value).toEqual(
        put({ type: I18N_REMOVE_MESSAGES, payload: { module: "my-feature" } }),
      );
    });
  });

  /*
  describe("runRefresher", () => {
    it("single run", async () => {
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
  */
});
