import * as constants from "../../../constants";
import reducer, { initialState, modulesReducers } from "../modules";

describe("modules reducer", () => {
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
      const spyError = jest.spyOn(console, "error");
      spyError.mockImplementation(() => {});

      const action = {
        type: "non-handled",
      };
      modulesReducers["my-feature-broken"] = (_localState, _action) => {
        throw "ouch";
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
      expect(spyError).toHaveBeenCalledWith("module my-feature-broken reducer failed to reduce", "ouch");

      expect(reducer(state, action)).toEqual(expectedState);
      expect(spyError).toHaveBeenCalledWith("module my-feature-broken reducer failed to reduce", "ouch");
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

  describe("I18N_MESSAGES_BATCH", () => {
    it("passthrough", () => {
      const action = {
        type: constants.I18N_MESSAGES_BATCH,
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
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

      const action = {
        type: constants.MODULE_INIT,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
      };
      expect(reducer(initialState, action)).toEqual(initialState);

      expect(spyDebug).toHaveBeenCalledWith("module my-feature initialized");
    });

    it("module with working reducer", () => {
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

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

      expect(spyDebug).toHaveBeenCalledWith("module my-feature initialized");
    });

    it("module with broken reducer", () => {
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

      const spyError = jest.spyOn(console, "error");
      spyError.mockImplementation(() => {});

      const action = {
        type: constants.MODULE_INIT,
        payload: {
          module: "my-feature",
        },
      };
      modulesReducers["my-feature"] = (_localState, _action) => {
        throw "ouch";
      };
      expect(reducer(initialState, action)).toEqual(initialState);

      expect(spyDebug).toHaveBeenCalledWith("module my-feature initialized");
      expect(spyError).toHaveBeenCalledWith("module my-feature reducer failed to reduce", "ouch");
    });
  });

  describe("MODULE_READY", () => {
    it("passthrough", () => {
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

      const spyInfo = jest.spyOn(console, "info");
      spyInfo.mockImplementation(() => {});

      const action = {
        type: constants.MODULE_READY,
        payload: {
          module: "my-feature",
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);

      expect(spyDebug).toHaveBeenCalledWith("module my-feature ready");
      expect(spyInfo).toHaveBeenCalledWith("+ module my-feature");
    });
  });

  describe("MODULE_UNLOADED", () => {
    it("with existing module state", () => {
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

      const spyInfo = jest.spyOn(console, "info");
      spyInfo.mockImplementation(() => {});

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

      expect(spyDebug).toHaveBeenCalledWith("module my-feature evicting redux state");
      expect(spyDebug).toHaveBeenCalledWith("module my-feature unloaded");
      expect(spyInfo).toHaveBeenCalledWith("- module my-feature");
    });

    it("without existing module state", () => {
      const spyDebug = jest.spyOn(console, "debug");
      spyDebug.mockImplementation(() => {});

      const spyInfo = jest.spyOn(console, "info");
      spyInfo.mockImplementation(() => {});

      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);

      expect(spyDebug).toHaveBeenCalledWith("module my-feature unloaded");
      expect(spyInfo).toHaveBeenCalledWith("- module my-feature");
    });
  });
});