import * as constants from "../../constants";
import reducer, { initialState } from "../localisation";

describe("localisation reducer", () => {
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

  describe("I18N_REMOVE_MESSAGES", () => {
    it("purges local shared state of module", () => {
      const action = {
        type: constants.I18N_REMOVE_MESSAGES,
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
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("purges localisation messages owned by this module", () => {
      const state = {
        ...initialState,
        language: "en-US",
      };

      const addMessagesAction = {
        type: constants.I18N_ADD_MESSAGES,
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
        type: constants.I18N_REMOVE_MESSAGES,
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
      };
      expect(reducer(nextState, action)).toEqual(expectedState);
    });
  });

  describe("I18N_ADD_MESSAGES", () => {
    it("empty batch", () => {
      const state = {
        ...initialState,
        language: "en-US",
      };

      const action = {
        type: constants.I18N_ADD_MESSAGES,
        payload: {
          batch: [],
          language: "en-US",
        },
      };
      expect(reducer(state, action)).toEqual(state);
    });

    it("empty batch different language", () => {
      const action = {
        type: constants.I18N_ADD_MESSAGES,
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
        type: constants.I18N_ADD_MESSAGES,
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
        type: constants.I18N_ADD_MESSAGES,
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
