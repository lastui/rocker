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
    it("purges local shared state of module", () => {
      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const state = {
        ...initialState,
        local: {
          "my-feature": {
            hair: "yes",
          },
        },
      };
      const expectedState = {
        ...initialState,
        lastUpdate: 1,
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("purges localisation messages owned by this module", () => {
      const state = {
        ...initialState,
        language: "en-US",
      };

      const addMessagesAction = {
        type: constants.I18N_MESSAGES_BATCH,
        payload: {
          language: "en-US",
          batch: [
            {
              module: "my-feature",
              data: {
                "message.key": "message.value",
              },
            },
          ],
        },
      };

      const action = {
        type: constants.MODULE_UNLOADED,
        payload: {
          module: "my-feature",
        },
      };
      const nextState = reducer(state, addMessagesAction);
      expect(nextState.messages["en-US"]["message.key"]).toEqual("message.value");
      const expectedState = {
        ...state,
        messages: {
          "en-US": {},
        },
        lastUpdate: 1,
      };
      expect(reducer(nextState, action)).toEqual(expectedState);
    });

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

  describe("I18N_MESSAGES_BATCH", () => {
    it("empty batch", () => {
      const state = {
        ...initialState,
        language: "en-US",
      };

      const action = {
        type: constants.I18N_MESSAGES_BATCH,
        payload: {
          batch: [],
          language: "en-US",
        },
      };
      expect(reducer(state, action)).toEqual(state);
    });

    it("empty batch different language", () => {
      const action = {
        type: constants.I18N_MESSAGES_BATCH,
        payload: {
          batch: [],
          language: "fr-FR",
        },
      };

      const expectedState = {
        ...initialState,
        language: "fr-FR",
      };

      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it("non empty batch same language", () => {
      const action = {
        type: constants.I18N_MESSAGES_BATCH,
        payload: {
          batch: [
            {
              module: "my-feature",
              data: {
                existing: "new",
                "message.key": "message.value",
                nested: {
                  localisation: "value",
                },
              },
            },
          ],
          language: "en-US",
        },
      };
      const state = {
        ...initialState,
        language: "en-US",
        messages: {
          "en-US": {
            existing: "old",
          },
        },
      };
      const expectedState = {
        ...initialState,
        language: "en-US",
        messages: {
          "en-US": {
            existing: "new",
            "message.key": "message.value",
            "nested.localisation": "value",
          },
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("non empty batch different language", () => {
      const action = {
        type: constants.I18N_MESSAGES_BATCH,
        payload: {
          batch: [
            {
              module: "my-feature",
              data: {
                existing: "new",
                "message.key": "message.value",
                nested: {
                  localisation: "value",
                },
              },
            },
          ],
          language: "fr-FR",
        },
      };
      const state = {
        ...initialState,
        language: "en-US",
        messages: {
          "en-US": {
            existing: "old",
          },
        },
      };
      const expectedState = {
        ...initialState,
        language: "fr-FR",
        messages: {
          "en-US": {
            existing: "old",
          },
          "fr-FR": {
            existing: "new",
            "message.key": "message.value",
            "nested.localisation": "value",
          },
        },
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });
});
