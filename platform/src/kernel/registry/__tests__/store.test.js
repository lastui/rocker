import configureStore from "redux-mock-store";

import { SET_SHARED } from "../../../constants";
import { setStore, getStore } from "../store";

describe("store registry", () => {
  const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    setStore(null);
    debugSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    debugSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe("getStore", () => {
    it("setter interception", () => {
      const store = getStore();
      expect(() => {
        store.foo = "bar";
      }).toThrow();
      expect(store.foo).toBeUndefined();
    });

    describe("fallback", () => {
      it(".getState", () => {
        const store = getStore();

        expect(store.getState()).toEqual({});
      });

      it(".dispatch", () => {
        const store = getStore();

        expect(typeof store.dispatch).toEqual("function");
        store.dispatch({ type: "foo" });
      });

      it(".subscribe", () => {
        const store = getStore();

        expect(typeof store.subscribe).toEqual("function");
        store.subscribe();
      });

      it(".replaceReducer", () => {
        const store = getStore();

        expect(typeof store.replaceReducer).toEqual("function");
        store.replaceReducer();
      });

      it(".wrap", () => {
        const store = getStore();

        expect(typeof store.wrap).toEqual("function");
        expect(store.wrap("x")).toEqual("x");
      });
    });

    describe("namespace", () => {
      it(".getState", () => {
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
            env: {},
            shared: {
              beach: "bar",
            },
          }),
        );

        let store = getStore().namespace("my-feature");

        expect(typeof store.getState).toEqual("function");
        expect(store.getState()).toEqual({
          foo: "bar",
          env: {},
          shared: {
            beach: "bar",
          },
        });

        expect(store.getState()).toEqual(store.getState());

        store = getStore().namespace("my-other-feature");
        expect(store.getState()).toEqual({
          foo: "baz",
          env: {},
          shared: {
            beach: "bar",
          },
        });

        const state = store.getState();

        expect(state.valueOf()).toEqual({
          foo: "baz",
          env: {},
          shared: {
            beach: "bar",
          },
        });
        expect(state.toString()).toEqual("[object Object]");
        expect(state.shared).toEqual({ beach: "bar" });

        expect(state.other).toBeUndefined();

        expect("shared" in state).toEqual(true);
        expect("foo" in state).toEqual(true);
        expect("other" in state).toEqual(false);

        expect(Reflect.ownKeys(state)).toEqual(["foo", "env", "shared"]);

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
        expect(storeRef.getActions()).toEqual([{ type: "$my-feature$foo" }]);
        storeRef.clearActions();

        store.dispatch({
          type: SET_SHARED,
          payload: {
            data: "secret",
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
          type: "@@BROADCAST",
          payload: {
            data: "chatter",
          },
        });
        expect(storeRef.getActions()).toEqual([
          {
            type: "@@BROADCAST",
            payload: {
              data: "chatter",
            },
          },
        ]);
        storeRef.clearActions();

        store.dispatch({ type: undefined });
        expect(storeRef.getActions()).toEqual([]);
        storeRef.clearActions();

        store.dispatch({ type: "$injection$ACTION" });
        expect(storeRef.getActions()).toEqual([]);
        storeRef.clearActions();

        store.dispatch({ type: "$my-feature$foo" });
        expect(storeRef.getActions()).toEqual([{ type: "$my-feature$foo" }]);
        storeRef.clearActions();
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

    it(".wrap", () => {
      const storeRef = configureStore([])({});
      setStore(storeRef);

      const store = getStore().namespace("my-feature");
      expect(typeof store.wrap).toEqual("function");

      expect(store.wrap()).toEqual();
      expect(store.wrap("$other-feature$THING")).toEqual("$other-feature$THING");
      expect(store.wrap("@@agenda/THING")).toEqual("@@agenda/THING");
      expect(store.wrap("THING")).toEqual("$my-feature$THING");
    });
  });
});
