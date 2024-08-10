import * as constants from "../../../constants";
import reducer, { initialState } from "../env";

describe("env reducer", () => {
  describe("is reducer", () => {
    it("has initial state", () => {
      const action = {
        type: "non-handled",
      };
      expect(reducer(undefined, action)).toEqual(initialState);
    });
    it("has default case", () => {
      const action = {
        type: "non-handled",
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("SET_ENTRYPOINT_MODULE", () => {
    it("bumps update", () => {
      const action = {
        type: constants.SET_ENTRYPOINT_MODULE,
        payload: {
          entrypoint: "my-feature",
        },
      };
      const state = { ...initialState };
      const expectedState = {
        ...initialState,
        lastUpdate: 1,
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("MODULE_READY", () => {
    it("marks module as ready", () => {
      const action = {
        type: constants.MODULE_READY,
        payload: {
          module: "my-feature",
        },
      };
      const state = { ...initialState };
      const expectedState = {
        ...initialState,
        readyModules: {
          "my-feature": true,
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("MODULE_LOADED", () => {
    it("bumps update", () => {
      const action = {
        type: constants.MODULE_LOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = { ...initialState };
      const expectedState = {
        ...initialState,
        lastUpdate: 1,
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("MODULE_UNLOADED", () => {
    it("marks module as no longer ready", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
        readyModules: {
          "still-there": true,
          "my-feature": true,
        },
      };
      const expectedState = {
        ...initialState,
        readyModules: {
          "still-there": true,
        },
        lastUpdate: 1,
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });
});
