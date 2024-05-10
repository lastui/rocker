import configureStore from "redux-mock-store";
import { runSaga, stdChannel } from "redux-saga";

import moduleLoader, { adaptModule, manualCleanup } from "../loader";
import { setSagaRunner } from "../saga";
import { setStore } from "../store";

jest.mock("../assets", () => ({
  downloadProgram: (name, scope) => {
    if (scope.url === "/my-broken-program.js") {
      return new Promise((_resolve, reject) => {
        reject(new Error("ouch"));
      });
    }
    if (scope.url === "/my-aborted-program.js") {
      return new Promise((_resolve, reject) => {
        const error = new Error("Testing");
        error.name = "AbortError";
        reject(error);
      });
    }
    if (scope.url === "/while-true.js") {
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              props: {
                boo: "far",
              },
            }),
          [60 * 1000],
        );
      });
    }
    return Promise.resolve({});
  },
}));

describe("loader registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  const controller = new AbortController();

  beforeEach(() => {
    const channel = stdChannel();
    const storeRef = configureStore([])({
      modules: {},
      env: {
        readyModules: {},
      },
    });
    setStore(storeRef);
    setSagaRunner((store, saga) =>
      runSaga(
        {
          context: {},
          channel,
          dispatch: store.dispatch,
          getState: store.getState,
        },
        saga,
      ),
    );
  });

  afterAll(() => {
    setStore(null);
    setSagaRunner(null);
  });

  describe("adaptModule", () => {
    it("is defined", () => {
      expect(adaptModule).toBeDefined();
    });

    it("adapt styles", async () => {
      const scope = {
        BUILD_ID: "my-feature-BUILD_ID",
      };
      const { view, cleanup } = await adaptModule("my-feature", scope);
      expect(cleanup).toBeDefined();
      expect(view).toEqual(null);
      cleanup();
    });

    it("adapt reducers", async () => {
      const scope = {
        reducers: {
          "my-state": (state = {}, _action) => state,
        },
      };
      const { view, cleanup } = await adaptModule("my-feature", scope);
      expect(cleanup).toBeDefined();
      expect(view).toEqual(null);
      cleanup();
    });

    it("adapt middleware", async () => {
      const scope = {
        middleware: () => (_store) => (next) => (action) => next(action),
      };
      const { view, cleanup } = await adaptModule("my-feature", scope);
      expect(cleanup).toBeDefined();
      expect(view).toEqual(null);
      cleanup();
    });

    it("adapt saga", async () => {
      const scope = {
        *saga() {},
      };
      const { view, cleanup } = await adaptModule("my-feature", scope);
      expect(cleanup).toBeDefined();
      expect(view).toEqual(null);
      cleanup();
    });

    it("adapt component", async () => {
      const scope = {
        Main: () => <div />,
      };
      const { view, cleanup } = await adaptModule("my-feature", scope);
      expect(cleanup).toBeDefined();
      expect(view).toBeDefined();
      cleanup();
    });

    it("does not silence errors", async () => {
      const scope = {
        middleware: 1,
      };
      await expect(adaptModule("my-feature", scope)).rejects.toThrow("middleware is not a function");
    });
  });

  describe("moduleLoader", () => {
    it("is defined", () => {
      expect(moduleLoader).toBeDefined();
    });

    describe(".getLoadedModule", () => {
      it("returns loaded module", async () => {
        const item = moduleLoader.getLoadedModule("my-feature");
        expect(item).not.toBeDefined();
      });
    });

    describe(".setAvailableModules", () => {
      beforeEach(async () => {
        await moduleLoader.setAvailableModules([]);
      });

      it("gained access to modules", async () => {
        const modules = [
          {
            name: "a",
            program: {
              url: "/a.js",
            },
          },
        ];

        await moduleLoader.setAvailableModules(modules);
      });

      it("lost access to modules", async () => {
        await moduleLoader.setAvailableModules([
          {
            name: "a",
            program: {
              url: "/a.js",
            },
          },
          {
            name: "b",
            program: {
              url: "/b.js",
            },
          },
        ]);

        expect(moduleLoader.getLoadedModule("a")).not.toBeDefined();
        expect(moduleLoader.getLoadedModule("b")).not.toBeDefined();

        await moduleLoader.loadModule("a", controller);
        await moduleLoader.loadModule("b", controller);

        expect(moduleLoader.getLoadedModule("a")).toBeDefined();
        expect(moduleLoader.getLoadedModule("b")).toBeDefined();

        await moduleLoader.setAvailableModules([
          {
            name: "a",
            program: {
              url: "/a.js",
            },
          },
        ]);

        expect(moduleLoader.getLoadedModule("a")).toBeDefined();
        expect(moduleLoader.getLoadedModule("b")).not.toBeDefined();
      });
    });

    describe(".loadModule", () => {
      beforeEach(async () => {
        jest.useFakeTimers();
        await moduleLoader.setAvailableModules([]);
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("no name provided", async () => {
        expect(await moduleLoader.loadModule(undefined, controller)).toEqual(false);
      });

      it("not available to load", async () => {
        const modules = [
          {
            name: "my-feature",
          },
        ];
        await moduleLoader.setAvailableModules(modules);
        expect(await moduleLoader.loadModule("my-feature", controller)).toEqual(false);
        expect(await moduleLoader.loadModule("my-other-feature", controller)).toEqual(false);
      });

      it("available to load", async () => {
        const modules = [
          {
            name: "my-feature",
            program: {
              url: "/my-program.js",
            },
            props: {
              foo: "bar",
            },
          },
          {
            name: "my-timeout-feature",
            program: {
              url: "/while-true.js",
            },
          },
          {
            name: "my-timeout-feature-with-props",
            program: {
              url: "/while-true.js",
            },
            props: {
              bee: "far",
            },
          },
        ];
        await moduleLoader.setAvailableModules(modules);
        expect(await moduleLoader.loadModule("my-feature", controller)).toEqual(true);
        expect(await moduleLoader.loadModule("my-feature", controller)).toEqual(false);

        const a = moduleLoader.loadModule("my-timeout-feature", controller);
        const b = moduleLoader.loadModule("my-timeout-feature", controller);

        jest.runAllTimers();

        expect(await a).toEqual(true);
        expect(await b).toEqual(true);

        const c = moduleLoader.loadModule("my-timeout-feature-with-props", controller);

        await moduleLoader.setAvailableModules(modules.filter((item) => item.name !== "my-timeout-feature-with-props"));

        jest.runAllTimers();

        expect(await c).toEqual(true);
      });

      it("has error boundaries", async () => {
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});
        spy.mockClear();

        const modules = [
          {
            name: "my-feature",
            program: {
              url: "/my-broken-program.js",
            },
          },
        ];
        await moduleLoader.setAvailableModules(modules);
        expect(await moduleLoader.loadModule("my-feature", controller)).toEqual(false);

        expect(spy).toHaveBeenCalledWith("module my-feature failed to load", new Error("ouch"));
      });

      it("silences AbortError", async () => {
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});
        spy.mockClear();

        const modules = [
          {
            name: "my-feature",
            program: {
              url: "/my-aborted-program.js",
            },
          },
        ];
        await moduleLoader.setAvailableModules(modules);
        expect(await moduleLoader.loadModule("my-feature", controller)).toEqual(false);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe(".isAvailable", () => {
      beforeEach(async () => {
        await moduleLoader.setAvailableModules([]);
      });

      it("checks is module is available", async () => {
        const available = moduleLoader.isAvailable("my-feature");
        expect(available).toEqual(false);
      });
    });

    describe(".isModuleLoading", () => {
      beforeEach(async () => {
        await moduleLoader.setAvailableModules([]);
      });

      it("checks is module is loading", async () => {
        const loading = moduleLoader.isModuleLoading("my-feature");
        expect(loading).toEqual(false);
      });
    });
  });

  describe("manualCleanup", () => {
    it("resets and cleans up loader into initial state", async () => {
      await moduleLoader.setAvailableModules([
        {
          name: "a",
          program: {
            url: "/a.js",
          },
        },
      ]);
      expect(moduleLoader.isAvailable("a")).toEqual(true);
      await moduleLoader.loadModule("a", controller);
      expect(moduleLoader.getLoadedModule("a")).toBeDefined();
      manualCleanup();
      expect(moduleLoader.getLoadedModule("a")).not.toBeDefined();
      expect(moduleLoader.isAvailable("a")).toEqual(false);
    });
  });
});
