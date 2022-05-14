import configureStore from "redux-mock-store";

import { SET_SHARED } from "../../../constants";
import { setStore, getStore } from "../store";

describe("store registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  beforeEach(() => {
    setStore(null);
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
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});

        const store = getStore();

        expect(typeof store.getState).toEqual("function");
        store.getState();

        expect(spy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".dispatch", () => {
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});

        const store = getStore();

        expect(typeof store.dispatch).toEqual("function");
        store.dispatch({ type: "foo" });

        expect(spy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".subscribe", () => {
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});

        const store = getStore();

        expect(typeof store.subscribe).toEqual("function");
        store.subscribe();

        expect(spy).toHaveBeenCalledWith("Redux store is not provided!");
      });

      it(".replaceReducer", () => {
        const spy = jest.spyOn(console, "error");
        spy.mockImplementation(() => {});

        const store = getStore();

        expect(typeof store.replaceReducer).toEqual("function");
        store.replaceReducer();

        expect(spy).toHaveBeenCalledWith("Redux store is not provided!");
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
            shared: {
              beach: "bar",
            },
          }),
        );

        let store = getStore().namespace("my-feature");

        expect(typeof store.getState).toEqual("function");
        expect(store.getState()).toEqual({
          foo: "bar",
          shared: {
            beach: "bar",
          },
        });

        expect(store.getState()).toEqual(store.getState());

        store = getStore().namespace("my-new-feature");
        expect(store.getState()).toEqual({
          foo: "baz",
          shared: {
            beach: "bar",
          },
        });
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