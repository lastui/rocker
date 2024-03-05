import configureStore from "redux-mock-store";

import { SET_SHARED } from "../../../constants";
import { setStore, getStore } from "../store";

describe("store registry", () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    setStore(null);
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    debugSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    debugSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("setStore", () => {});

  describe("getStore", () => {
    it("setter interception", () => {
      const store = getStore();
      expect(() => {
        store.foo = "bar";
      }).toThrow();
      expect(store.foo).not.toBeDefined();
    });

    describe("fallback", () => {
      it(".getState", () => {
        const store = getStore();

        expect(typeof store.getState).toEqual("function");
        store.getState();

        expect(errorSpy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".dispatch", () => {
        const store = getStore();

        expect(typeof store.dispatch).toEqual("function");
        store.dispatch({ type: "foo" });

        expect(errorSpy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".subscribe", () => {
        const store = getStore();

        expect(typeof store.subscribe).toEqual("function");
        store.subscribe();

        expect(errorSpy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".replaceReducer", () => {
        const store = getStore();

        expect(typeof store.replaceReducer).toEqual("function");
        store.replaceReducer();

        expect(errorSpy).not.toHaveBeenCalledWith("Redux store is not provided!");
      });
    });

    describe("namespace", () => {
      it(".getState in NODE_ENV=development", () => {
        setStore(
          configureStore([])({
            modules: {
              "my-feature": {
                foo: "bat",
              },
              "my-other-feature": {
                foo: "baz",
              },
            },
            shared: {
              beach: "bar",
            },
          }),
        );

        process.env.NODE_ENV = "development";

        const store = getStore().namespace("my-feature");

        expect(typeof store.getState).toEqual("function");

        const state = store.getState();

        expect(state).toEqual(store.getState());

        expect(state).toEqual({
          foo: "bat",
          shared: {
            beach: "bar",
          },
        });
        expect(state.valueOf()).toEqual({
          foo: "bat",
          shared: {
            beach: "bar",
          },
        });
        expect(state.toString()).toEqual("[object Object]");
        expect(state.shared).toEqual({ beach: "bar" });
        errorSpy.mockClear();

        expect(state.other).not.toBeDefined();
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining('module "my-feature" tried to access reducer "other" that it does not own.'),
        );

        expect("shared" in state).toEqual(true);
        expect("foo" in state).toEqual(true);
        expect("other" in state).toEqual(false);

        expect(Reflect.ownKeys(state)).toEqual(["foo", "shared"]);

        state.foo = "mutation";

        expect(() => {
          state.shared.beach = "injection";
        }).toThrow(TypeError);

        expect(state.shared.beach).toEqual("bar");
      });

      it(".getState in NODE_ENV=production", () => {
        setStore(
          configureStore([])({
            modules: {
              "my-feature": {
                foo: "bar",
              },
              "my-other-feature": {
                foo: "baz",
              },
            },
            shared: {
              beach: "bar",
            },
          }),
        );

        process.env.NODE_ENV = "production";

        let store = getStore().namespace("my-feature");

        expect(typeof store.getState).toEqual("function");
        expect(store.getState()).toEqual({
          foo: "bar",
          shared: {
            beach: "bar",
          },
        });

        expect(store.getState()).toEqual(store.getState());

        store = getStore().namespace("my-other-feature");
        expect(store.getState()).toEqual({
          foo: "baz",
          shared: {
            beach: "bar",
          },
        });

        const state = store.getState();

        expect(state.valueOf()).toEqual({
          foo: "baz",
          shared: {
            beach: "bar",
          },
        });
        expect(state.toString()).toEqual("[object Object]");
        expect(state.shared).toEqual({ beach: "bar" });

        expect(state.other).not.toBeDefined();

        expect("shared" in state).toEqual(true);
        expect("foo" in state).toEqual(true);
        expect("other" in state).toEqual(false);

        expect(Reflect.ownKeys(state)).toEqual(["foo", "shared"]);

        expect(() => {
          state.shared.beach = "injection";
        }).toThrow(TypeError);

        expect(state.shared.beach).toEqual("bar");
      });

      it(".dispatch", () => {
        const storeRef = configureStore([])({});
        setStore(storeRef);

        const store = getStore().namespace("my-feature");

        expect(typeof store.dispatch).toEqual("function");
        store.dispatch({ type: "foo" });

        expect(storeRef.getActions()).toEqual([{ type: "foo" }]);
        storeRef.clearActions();

        store.dispatch({
          type: SET_SHARED,
          payload: {
            data: "secret",
            module: true,
          },
        });

        expect(storeRef.getActions()).toEqual([
          {
            type: SET_SHARED,
            payload: {
              data: "secret",
              module: "my-feature",
            },
          },
        ]);

        storeRef.clearActions();

        store.dispatch({
          type: SET_SHARED,
          payload: {
            data: "secret",
            module: false,
          },
        });

        expect(storeRef.getActions()).toEqual([
          {
            type: SET_SHARED,
            payload: {
              data: "secret",
            },
          },
        ]);
      });

      it(".subscribe", () => {
        const store = getStore().namespace("my-feature");

        expect(typeof store.subscribe).toEqual("function");
        store.subscribe();
      });

      it(".replaceReducer", () => {
        const store = getStore().namespace("my-feature");

        expect(typeof store.replaceReducer).toEqual("function");
        store.replaceReducer();
      });
    });
  });
});
