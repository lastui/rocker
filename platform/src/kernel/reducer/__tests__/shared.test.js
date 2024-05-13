import * as constants from "../../../constants";
import reducer, { initialState } from "../shared";

describe("shared reducer", () => {
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

  it("CLEAR_SHARED", () => {
    const action = {
      type: constants.CLEAR_SHARED,
      payload: {},
    };
    const state = {
      ...initialState,
      global: {
        hair: "yes",
      },
      local: {
        hair: [
          {
            data: "no",
            module: "my-other-feature",
            ts: 1676332800000,
          },
          {
            data: "maybe",
            module: "my-feature",
            ts: 1581638400000,
          },
        ],
      },
      view: {
        hair: "no",
      },
    };
    const expectedState = {
      ...initialState,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  describe("SET_SHARED", () => {
    it("module not set", () => {
      const action = {
        type: constants.SET_SHARED,
        payload: {
          data: {
            hair: "yes",
          },
        },
      };
      const state = { ...initialState };
      const expectedState = {
        ...initialState,
        global: {
          hair: "yes",
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module updates self", () => {
      jest.spyOn(global.Date, "now").mockImplementationOnce(() => Date.parse("2020-02-14"));

      let action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "yes",
          },
        },
      };

      let state = { ...initialState };
      let expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1581638400000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

      jest.spyOn(global.Date, "now").mockImplementationOnce(() => Date.parse("2023-02-14"));

      action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "no",
          },
        },
      };

      expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: "no",
              module: "my-feature",
              ts: 1676332800000,
            },
          ],
        },
        view: {
          hair: "no",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module masks data", () => {
      jest.spyOn(global.Date, "now").mockImplementationOnce(() => Date.parse("2021-02-14"));

      let action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "yes",
          },
        },
      };

      let state = { ...initialState };
      let expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1613260800000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

      jest.spyOn(global.Date, "now").mockImplementationOnce(() => Date.parse("2023-02-14"));

      action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-other-feature",
          data: {
            hair: undefined,
          },
        },
      };

      expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: undefined,
              module: "my-other-feature",
              ts: 1676332800000,
            },
            {
              data: "yes",
              module: "my-feature",
              ts: 1613260800000,
            },
          ],
        },
        view: {},
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

      jest.spyOn(global.Date, "now").mockImplementationOnce(() => Date.parse("2020-02-14"));

      action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-other-feature",
          data: {
            hair: undefined,
          },
        },
      };

      expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1613260800000,
            },
            {
              data: undefined,
              module: "my-other-feature",
              ts: 1581638400000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module set to invalid", () => {
      const action = {
        type: constants.SET_SHARED,
        payload: {
          module: 42,
          data: {
            hair: "yes",
          },
        },
      };
      const state = { ...initialState };
      const expectedState = { ...initialState };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("MODULE_UNLOADED", () => {
    it("purges local shared state of module", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-other-feature",
        },
      };
      const state = {
        ...initialState,
        local: {
          hair: [
            {
              data: "no",
              module: "my-other-feature",
              ts: 1600000000000,
            },
            {
              data: "maybe",
              module: "my-another-feature",
              ts: 1400000000000,
            },
            {
              data: "yes",
              module: "my-feature",
              ts: 1500000000000,
            },
          ],
        },
        view: {
          hair: "no",
        },
      };
      const expectedState = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1500000000000,
            },
            {
              data: "maybe",
              module: "my-another-feature",
              ts: 1400000000000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("did not have shared data", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-other-feature",
        },
      };
      const state = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1581638400000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(state);
    });

    it("was only one holding shared data key", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
        local: {
          hair: [
            {
              data: "yes",
              module: "my-feature",
              ts: 1581638400000,
            },
          ],
        },
        view: {
          hair: "yes",
        },
      };

      expect(reducer(state, action)).toEqual(initialState);
    });
  });
});
