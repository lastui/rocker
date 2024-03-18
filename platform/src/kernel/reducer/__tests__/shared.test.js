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
      hair: "yes",
      feet: "two",
    };
    const expectedState = {
      ...initialState,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  describe("SET_SHARED", () => {
    it("set data", () => {
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

    it("modify data", () => {
      const action = {
        type: constants.SET_SHARED,
        payload: {
          data: {
            hair: "no",
          },
        },
      };
      const state = {
        ...initialState,
        hair: "yes",
      };
      const expectedState = {
        ...initialState,
        hair: "no",
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("remove data", () => {
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
  });
});
