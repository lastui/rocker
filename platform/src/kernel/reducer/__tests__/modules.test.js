import * as constants from "../../../constants";
import reducer, { initialState, modulesReducers } from "../modules";

describe("modules reducer", () => {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    errorSpy.mockClear();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  afterEach(() => {
    const dangling = [];
    for (const tuple of modulesReducers) {
      dangling.push(tuple[0]);
    }
    for (const id of dangling) {
      delete modulesReducers[id];
    }
  });

  describe("modulesReducers set", () => {
    it("set truthy", () => {
      modulesReducers["test-probe"] = () => {};
    });

    it("set falsey", () => {
      expect(() => {
        modulesReducers["test-probe"] = false;
      }).toThrow();
    });

    it("replace existing", () => {
      modulesReducers["test-probe"] = 1;
      modulesReducers["test-probe"] = 2;
      expect(modulesReducers["test-probe"]).toEqual(2);
    });

    it("delete existing", () => {
      modulesReducers["test-probe"] = () => {};
      delete modulesReducers["test-probe"];
    });

    it("delete non existing", () => {
      delete modulesReducers["test-probe"];
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

    it("reduce on modules reducers", () => {
      const action = {
        type: "non-handled",
      };
      modulesReducers["my-feature-broken"] = (_localState, _action) => {
        throw new Error("ouch");
      };
      modulesReducers["my-feature-fine"] = (localState = {}, _action) => ({
        ...localState,
        me: "shiny",
      });
      modulesReducers["my-feature-noop"] = (localState = {}, _action) => localState;
      const state = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        "my-feature-fine": {
          me: "shiny",
        },
        "my-feature-noop": {},
      };

      expect(reducer(state, action)).toEqual(expectedState);

      expect(reducer(expectedState, action)).toEqual(expectedState);
      expect(errorSpy).toHaveBeenCalledWith("module my-feature-broken reducer failed to reduce", new Error("ouch"));
    });

    it("handles broadcast action", () => {
      const action = {
        type: "@@FEATURE_BROADCASTING_A_THING",
      };

      modulesReducers["my-feature-sniff"] = (localState = {}, action) => ({
        ...localState,
        lastAction: action.type,
      });
      const state = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        "my-feature-sniff": {
          lastAction: "@@FEATURE_BROADCASTING_A_THING",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("handles owned action", () => {
      const action = {
        type: "$my-feature-sniff$OWNED_ACTION",
      };

      modulesReducers["my-feature-sniff"] = (localState = {}, action) => ({
        ...localState,
        lastAction: action.type,
      });
      const state = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        "my-feature-sniff": {
          lastAction: "OWNED_ACTION",
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("INIT", () => {
    it("passthrough", () => {
      const action = {
        type: constants.INIT,
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("REFRESH", () => {
    it("passthrough", () => {
      const action = {
        type: constants.REFRESH,
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("FETCH_CONTEXT", () => {
    it("passthrough", () => {
      const action = {
        type: constants.FETCH_CONTEXT,
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("MODULE_LOADED", () => {
    it("passthrough", () => {
      const action = {
        type: constants.MODULE_LOADED,
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("SET_AVAILABLE_MODULES", () => {
    it("passthrough", () => {
      const action = {
        type: constants.SET_AVAILABLE_MODULES,
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("MODULE_INIT", () => {
    it("module without reducer", () => {
      const action = {
        type: constants.MODULE_INIT,
        payload: {
          module: "my-feature",
        },
      };

      expect(reducer(initialState, action)).toEqual(initialState);
    });

    it("module with working reducer", () => {
      const action = {
        type: constants.MODULE_INIT,
        payload: {
          module: "my-feature",
        },
      };
      modulesReducers["my-feature"] = (localState = {}, _action) => ({
        ...localState,
        key: "value",
      });
      const state = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        "my-feature": {
          key: "value",
        },
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("module with broken reducer", () => {
      const action = {
        type: constants.MODULE_INIT,
        payload: {
          module: "my-feature",
        },
      };
      modulesReducers["my-feature"] = (_localState, _action) => {
        throw new Error("ouch");
      };
      expect(reducer(initialState, action)).toEqual(initialState);

      expect(errorSpy).toHaveBeenCalledWith(
        "module my-feature reducer failed to reduce on action @@modules/INIT",
        new Error("ouch"),
      );
    });
  });

  describe("MODULE_READY", () => {
    it("passthrough", () => {
      const action = {
        type: constants.MODULE_READY,
        payload: {
          module: "my-feature",
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("MODULE_UNLOADED", () => {
    it("with existing module state", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
        "my-feature": {
          key: "value",
        },
      };
      const expectedState = {
        ...initialState,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("without existing module state", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });
});
