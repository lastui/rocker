import { CANCEL } from "redux-saga";

import { downloadAsset, downloadProgram, SequentialProgramEvaluator } from "../assets";

describe("assets registry", () => {
  global.fetch = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    global.fetch.mockClear();
  });

  describe("downloadAsset", () => {
    it("happy path", async () => {
      global.fetch.mockImplementationOnce(async () => new Response("data", { status: 200, statusText: "OK" }));

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
      global.fetch.mockImplementationOnce(async () => new Response(null, { status: 404, statusText: "Not Found" }));

      await expect(downloadAsset("/path/data.json")).rejects.toThrow("404");
    });

    it("aborted (timeout) path", async () => {
      global.fetch.mockImplementationOnce(
        (uri, options) =>
          new Promise((resolve, reject) => {
            options.signal.onabort = function () {
              reject(new Error("Mocked Abort!"));
            };
          }),
      );

      const promise = downloadAsset("/path/data.json");

      jest.runAllTimers();

      await expect(promise).rejects.toThrow("timeout");
    });

    it("aborted (saga CANCEL) path", async () => {
      global.fetch.mockImplementationOnce(
        (uri, options) =>
          new Promise((resolve, reject) => {
            options.signal.onabort = function () {
              reject(new Error("Mocked Abort!"));
            };
          }),
      );

      const promise = downloadAsset("/path/data.json");

      promise[CANCEL]();

      await expect(promise).rejects.toThrow("Saga canceled.");
    });

    it("aborted (parent abort) path", async () => {
      global.fetch.mockImplementationOnce(
        (uri, options) =>
          new Promise((resolve, reject) => {
            options.signal.onabort = function () {
              reject(new Error("Mocked Abort!"));
            };
          }),
      );

      const controller = new AbortController();

      const promise = downloadAsset("/path/data.json", controller);

      controller.abort(new Error("Parent abortion reasons."));

      await expect(promise).rejects.toThrow("Parent abortion reasons.");
    });
  });

  describe("downloadProgram", () => {
    it("when no argument provided", async () => {
      const result = await downloadProgram("my-feature");
      expect(result).toBeDefined();
    });

    it("compiles program", async () => {
      global.fetch.mockImplementationOnce(
        async () =>
          new Response(`!function(){ top.__SANDBOX_SCOPE__.component = () => 'main' }();`, { status: 200, statusText: "OK" }),
      );

      const result = await downloadProgram("my-feature", {
        url: "/service/program.js",
      });

      expect(result.component()).toEqual("main");
    });

    it("raises error when program is not a module", async () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      spy.mockClear();

      global.fetch.mockImplementationOnce(async () => new Response(`<html/>`, { status: 200, statusText: "OK" }));

      const result = await downloadProgram("my-feature", {
        url: "/service/program.js",
      });

      expect(result.component).toBeDefined();
      expect(() => result.component()).toThrow(new Error("Unexpected token '<'"));
      expect(spy).toHaveBeenCalledWith("asset for module my-feature is not a module");
    });

    it("has error boundaries", async () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      spy.mockClear();

      global.fetch.mockImplementationOnce(
        async () => new Response(`!function(){ throw new Error('ouch'); }();`, { status: 200, statusText: "OK" }),
      );

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
