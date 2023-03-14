import runtimeReducer from "../runtime";
import { constants } from "@lastui/rocker/platform";

describe("runtimeReducer", () => {
  it("initial state", () => {
    const action = { type: "stub" };
    const initialState = runtimeReducer(undefined, action);
    expect(initialState).toEqual({
      entrypoint: null,
      available: {},
    });
  });

  it("SET_ENTRYPOINT_MODULE", () => {
    const action = {
      type: constants.SET_ENTRYPOINT_MODULE,
      payload: {
        entrypoint: "value",
      },
    };
    const nextState = runtimeReducer(undefined, action);
    expect(nextState.entrypoint).toEqual("value");
  });

  it("SET_AVAILABLE_MODULES", () => {
    const firstAction = {
      type: constants.SET_AVAILABLE_MODULES,
      payload: {
        modules: [
          {
            name: "A",
          },
          {
            name: "C",
          },
          {
            name: "B",
          },
        ],
      },
    };
    const nextState = runtimeReducer(undefined, firstAction);
    expect(nextState.available).toEqual({ A: true, B: true, C: true });

    const secondAction = {
      type: constants.SET_AVAILABLE_MODULES,
      payload: {
        modules: [
          {
            name: "A",
          },
          {
            name: "C",
          },
          {},
        ],
      },
    };
    const anotherState = runtimeReducer(nextState, secondAction);
    expect(anotherState.available).toEqual({ A: true, C: true });
  });
});
