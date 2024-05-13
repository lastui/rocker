import * as constants from "../../../constants";
import reducer, { initialState } from "../shared";

describe("shared reducer", () => {
  beforeEach(() => {
    reducer(undefined, {
      type: constants.CLEAR_SHARED,
      payload: {},
    });
  });

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
      hair: "no",
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
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module not set purges data", () => {
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          data: {
            hair: "yes",
          },
        },
      });

      const action = {
        type: constants.SET_SHARED,
        payload: {
          data: {
            hair: undefined,
          },
        },
      };
      const state = {
        ...initialState,
        hair: "yes",
      };
      const expectedState = {
        ...initialState,
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module updates self", () => {
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
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

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
        hair: "no",
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module with empty", () => {
      const action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {},
        },
      };

      expect(reducer(initialState, action)).toEqual(initialState);
    });

    it("module masks data", () => {
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
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

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
      };

      expect(reducer(state, action)).toEqual(expectedState);

      state = expectedState;

      action = {
        type: constants.SET_SHARED,
        payload: {
          module: "my-other-feature",
          data: {
            hair: "no",
          },
        },
      };

      expectedState = {
        ...initialState,
        hair: "no",
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
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          module: "my-another-feature",
          data: {
            hair: "maybe",
          },
        },
      });
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          module: "my-other-feature",
          data: {
            hair: "yes",
          },
        },
      });
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "yes",
          },
        },
      });

      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-other-feature",
        },
      };
      const state = {
        ...initialState,
        hair: "no",
      };
      const expectedState = {
        ...initialState,
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("did not have shared data", () => {
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "yes",
          },
        },
      });

      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-other-feature",
        },
      };
      const state = {
        ...initialState,
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(state);
    });

    it("was only one holding shared data key", () => {
      reducer(undefined, {
        type: constants.SET_SHARED,
        payload: {
          module: "my-feature",
          data: {
            hair: "yes",
          },
        },
      });

      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
        hair: "yes",
      };

      expect(reducer(state, action)).toEqual(initialState);
    });
  });
});
