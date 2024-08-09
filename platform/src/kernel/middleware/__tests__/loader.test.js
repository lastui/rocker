import configureStore from "redux-mock-store";

import * as constants from "../../../constants";
//import { downloadAsset } from "../../registry/assets";
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

//jest.mock("../../registry/assets", () => {
//  const downloadAsset = jest.fn();
//  downloadAsset.mockImplementation(async (uri) => {
//    if (uri === "/i18n/broken.json") {
//      throw new Error("ouch");
//    }
//
//    return {
//      json: async () => {
//        if (uri === "/i18n/empty.json") {
//          return {};
//        }
//        return {
//          foo: "bar",
//        };
//      },
//    };
//  });
//
//  return {
//    downloadAsset,
//  };
//});

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
    const store = configureStore([loaderMiddleware])({ env: {}, shared: {} });
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
        throw new Error("ouch");
      }
      return localAction;
    };

    const actual = createLoaderMiddleware()()(next)(action);
    expect(actual).toEqual(action);

    expect(spy).toHaveBeenLastCalledWith("loader middleware errored", new Error("ouch"));
  });

  describe("SET_AVAILABLE_MODULES", () => {
    it("calls setAvailableModules on loader", async () => {
      const loaderMiddleware = createLoaderMiddleware();
      const store = configureStore([loaderMiddleware])({ env: {}, shared: {} });
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
      const store = configureStore([loaderMiddleware])({ env: {}, shared: {} });
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
      const store = configureStore([loaderMiddleware])({ env: {}, shared: {} });
      const action = {
        type: constants.SET_ENTRYPOINT_MODULE,
        payload: {
          entrypoint: "my-feature",
        },
      };

      store.dispatch(action);
      await new Promise(process.nextTick);

      expect(loader.loadModule).toHaveBeenCalledWith("my-feature", expect.anything());
      expect(store.getActions()).toEqual([action]);
    });
  });
});
