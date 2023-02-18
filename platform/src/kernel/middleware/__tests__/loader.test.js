import configureStore from "redux-mock-store";

import * as constants from "../../../constants";
import { downloadAsset } from "../../registry/assets";
import loader from "../../registry/loader";
import createLoaderMiddleware from "../loader";

jest.mock("../../registry/loader", () => {
  const setAvailableModules = jest.fn();
  setAvailableModules.mockReturnValue(Promise.resolve(true));

  const loadModule = jest.fn();
  loadModule.mockReturnValue(Promise.resolve(true));

  return {
    setAvailableModules,
    loadModule,
  };
});

jest.mock("../../registry/assets", () => {
  const downloadAsset = jest.fn();
  downloadAsset.mockImplementation(async (uri) => {
    if (uri === "/i18n/broken.json") {
      throw "ouch";
    }

    return {
      json: async () => {
        if (uri === "/i18n/empty.json") {
          return {};
        }
        return {
          foo: "bar",
        };
      },
    };
  });

  return {
    downloadAsset,
  };
});

describe("loader middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLoaderMiddleware", () => {
    it("is function", () => {
      expect(typeof createLoaderMiddleware).toEqual("function");
    });
  });

  it("has default case", () => {
    const action = {
      type: "non-handled",
    };
    const loaderMiddleware = createLoaderMiddleware();
    const store = configureStore([loaderMiddleware])({});
    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);
  });

  it("has error boundaries", () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});
    spy.mockClear();

    const action = {
      type: "non-handled",
    };
    let counter = 0;

    const next = (localAction) => {
      if (++counter === 1) {
        throw "ouch";
      }
      return localAction;
    };

    const actual = createLoaderMiddleware()()(next)(action);
    expect(actual).toEqual(action);

    expect(spy).toHaveBeenLastCalledWith("dynamic middleware errored", "ouch");
  });

  describe("SET_AVAILABLE_MODULES", () => {
    it("calls setAvailableModules on loader", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({});
      const action = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature" }],
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(loader.setAvailableModules).toHaveBeenCalledWith(action.payload.modules);
      expect(store.getActions()).toEqual([action]);
    });

    it("marks availableLocales", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({});
      const action = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [
            { name: "my-feature-a" },
            { name: "my-feature-b", locales: {} },
            { name: "my-feature-c", locales: { "en-US": {} } },
          ],
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(loader.setAvailableModules).toHaveBeenCalledWith(action.payload.modules);
      expect(store.getActions()).toEqual([action]);
    });
  });

  describe("SET_ENTRYPOINT_MODULE", () => {
    it("calls loadModule on loader", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({});
      const action = {
        type: constants.SET_ENTRYPOINT_MODULE,
        payload: {
          entrypoint: "my-feature",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(loader.loadModule).toHaveBeenCalledWith("my-feature");
      expect(store.getActions()).toEqual([action]);
    });
  });

  describe("MODULE_LOADED", () => {
    let debugSpy = null;

    beforeEach(() => {
      debugSpy = jest.spyOn(console, "debug");
      debugSpy.mockImplementation(() => {});
      debugSpy.mockClear();
    });

    afterEach(() => {
      expect(debugSpy).toHaveBeenCalledWith("module my-feature loaded");
    });

    it("no language in state", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: null,
        },
      });

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("no availableLocales", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en—US",
        },
      });

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("missing uri in availableLocales for selected language", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en—US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature", locales: { "en-US": false } }],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("existing uri in availableLocales for selected language (broken asset)", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en-US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature", locales: { "en-US": "/i18n/broken.json" } }],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);

      expect(downloadAsset).toHaveBeenLastCalledWith("/i18n/broken.json");
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("existing uri in availableLocales for selected language (valid empty asset)", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en-US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature", locales: { "en-US": "/i18n/empty.json" } }],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);

      expect(downloadAsset).toHaveBeenLastCalledWith("/i18n/empty.json");
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("existing uri in availableLocales for selected language (valid non-empty asset)", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en-US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature", locales: { "en-US": "/i18n/valid.json" } }],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);

      expect(downloadAsset).toHaveBeenLastCalledWith("/i18n/valid.json");
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        {
          type: constants.I18N_MESSAGES_BATCH,
          payload: {
            batch: [
              {
                data: {
                  foo: "bar",
                },
                module: "my-feature",
              },
            ],
            language: "en-US",
          },
        },
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });

    it("existing uri in availableLocales for selected language (already loaded)", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en-US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [{ name: "my-feature", locales: { "en-US": "/i18n/valid.json" } }],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(action);

      expect(downloadAsset).toHaveBeenLastCalledWith("/i18n/valid.json");
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        {
          type: constants.I18N_MESSAGES_BATCH,
          payload: {
            batch: [
              {
                data: {
                  foo: "bar",
                },
                module: "my-feature",
              },
            ],
            language: "en-US",
          },
        },
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      store.clearActions();
      store.dispatch(action);

      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        { type: constants.MODULE_INIT, payload: { module: "my-feature" } },
        { type: constants.MODULE_READY, payload: { module: "my-feature" } },
      ]);

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });
  });

  describe("SET_LANGUAGE", () => {
    it("loads messages for new language that are already loaded for other language", async () => {
      const spy = jest.spyOn(console, "debug");
      spy.mockImplementation(() => {});
      spy.mockClear();

      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({
        shared: {
          language: "en-US",
        },
      });

      const setupAvailableLocalesAction = {
        type: constants.SET_AVAILABLE_MODULES,
        payload: {
          modules: [
            {
              name: "my-feature",
              locales: { "en-US": "/i18n/valid.json", "fr-FR": "/i18n/valid.json" },
            },
          ],
        },
      };

      store.dispatch(setupAvailableLocalesAction);
      await new Promise(process.nextTick);

      store.clearActions();

      const loaderAction = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(loaderAction);

      expect(downloadAsset).toHaveBeenLastCalledWith("/i18n/valid.json");
      await new Promise(process.nextTick);

      store.clearActions();

      const action = {
        type: constants.SET_LANGUAGE,
        payload: {
          language: "fr-FR",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        {
          type: constants.I18N_MESSAGES_BATCH,
          payload: {
            batch: [
              {
                data: {
                  foo: "bar",
                },
                module: "my-feature",
              },
            ],
            language: "fr-FR",
          },
        },
      ]);

      expect(spy).toHaveBeenLastCalledWith("module my-feature introducing locales for fr-FR");

      spy.mockClear();
      store.clearActions();

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(store.getActions()).toEqual([
        {
          type: constants.I18N_MESSAGES_BATCH,
          payload: {
            batch: [],
            language: "fr-FR",
          },
        },
      ]);

      expect(spy).not.toHaveBeenLastCalledWith("module my-feature introducing locales for fr-FR");

      const unloadAction = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };

      store.dispatch(unloadAction);
    });
  });

  describe("MODULE_UNLOADED", () => {
    it("purges availableLocales", () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({});
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature-c",
        },
      };

      store.dispatch(action);
      expect(store.getActions()).toEqual([action]);
    });

    it("passthough", () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({});
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature-a",
        },
      };

      store.dispatch(action);
      expect(store.getActions()).toEqual([action]);
    });
  });
});