import { CANCEL } from "redux-saga";

import { downloadAsset, downloadProgram, SequentialProgramEvaluator } from "../assets";

describe("assets registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  global.fetch = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    global.fetch.mockClear();
    debugSpy.mockClear();
  });

  describe("downloadAsset", () => {
    it("happy path", async () => {
      global.fetch.mockImplementationOnce(async () => ({
        ok: true,
        status: 200,
        text: async () => "data",
        headers: {
          get() {},
        },
      }));

      const result = await downloadAsset("/path/data.json");

      expect(global.fetch).toHaveBeenCalledWith(
        "/path/data.json",
        expect.objectContaining({
          cache: "no-cache",
          referrerPolicy: "no-referrer",
          mode: "cors",
          credentials: "same-origin",
        }),
      );

      const data = await result.text();
      expect(data).toEqual("data");
    });

    it("error path", async () => {
      global.fetch.mockImplementationOnce(async () => ({
        ok: false,
        status: 404,
      }));

      await expect(downloadAsset("/path/data.json")).rejects.toThrow("404");
    });

    it("aborted (timeout) path", async () => {
      global.fetch.mockImplementationOnce(
        (uri, options) =>
          new Promise((resolve, reject) => {
            options.signal.onabort = function () {
              reject("aborted");
            };
          }),
      );

      const promise = downloadAsset("/path/data.json");

      jest.runAllTimers();

      try {
        await promise;
        throw new Error("request was not aborted");
      } catch (err) {
        expect(err).toEqual("aborted");
      }
    });

    it("aborted (saga CANCEL) path", async () => {
      global.fetch.mockImplementationOnce(
        (uri, options) =>
          new Promise((resolve, reject) => {
            options.signal.onabort = function () {
              reject("aborted");
            };
          }),
      );

      const promise = downloadAsset("/path/data.json");

      promise[CANCEL]();

      try {
        await promise;
        throw new Error("request was not aborted");
      } catch (err) {
        expect(err).toEqual("aborted");
      }
    });
  });

  describe("downloadProgram", () => {
    it("when no argument provided", async () => {
      const result = await downloadProgram("my-feature");
      expect(result).toBeDefined();
    });

    it("compiles program", async () => {
      global.fetch.mockImplementationOnce(async () => ({
        ok: true,
        status: 200,
        text: async () => `!function(){
          window.__SANDBOX_SCOPE__.component = () => 'main'
        }();`,
        headers: {
          get() {},
        },
      }));

      const result = await downloadProgram("my-feature", {
        url: "/service/program.js",
      });

      expect(result.component()).toEqual("main");
    });

    it("raises error when program is not a module", async () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      spy.mockClear();

      global.fetch.mockImplementationOnce(async () => ({
        ok: true,
        status: 200,
        text: async () => `
          window.__SANDBOX_SCOPE__.component = () => 'main';
        `,
        headers: {
          get() {},
        },
      }));

      const result = await downloadProgram("my-feature", {
        url: "/service/program.js",
      });

      expect(result.component).toBeDefined();
      expect(() => result.component()).toThrow(new Error("Asset is not a module"));
      expect(spy).toHaveBeenCalledWith("module my-feature failed to adapt");
    });

    it("has error boundaries", async () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      spy.mockClear();

      global.fetch.mockImplementationOnce(async () => ({
        ok: true,
        status: 200,
        text: async () => `!function(){
          throw new Error('ouch');
        }();`,
        headers: {
          get() {},
        },
      }));

      const result = await downloadProgram("my-feature", {
        url: "/service/program.js",
      });

      expect(result.component).toBeDefined();
      expect(() => result.component()).toThrow(new Error("ouch"));
      expect(spy).toHaveBeenCalledWith("module my-feature failed to adapt");
    });
  });

  describe("SequentialProgramEvaluator", () => {
    it("compiles sequentially", async () => {
      const a = SequentialProgramEvaluator.compile("my-feature-a", "");
      const b = async () => SequentialProgramEvaluator.tick();
      const c = SequentialProgramEvaluator.compile("my-feature-c", "");
      const d = SequentialProgramEvaluator.compile("my-feature-d", null);

      await Promise.all([b, a, b, c, d, c, b, b, b]);
    });
  });
});
