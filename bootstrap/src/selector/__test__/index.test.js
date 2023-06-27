import * as selectors from "..";

describe("selector", () => {
  const state = {
    runtime: {
      entrypoint: "value",
    },
    shared: {
      language: "en-US",
      messages: {
        "en-US": {
          foo: "bar",
        },
      },
    },
  };

  describe(".getEntrypoint", () => {
    it("should return entrypoint", () => {
      expect(selectors.getEntrypoint(state)).toEqual("value");
    });
  });

  describe(".getLanguage", () => {
    it("should return language", () => {
      expect(selectors.getLanguage(state)).toEqual("en-US");
    });
  });

  describe(".getI18nMessages", () => {
    it("should return i18n messages (exists for currently selected language)", () => {
      expect(selectors.getI18nMessages(state)).toEqual(state.shared.messages["en-US"]);
    });
    it("should return same empty object (does not exists for currently selected language)", () => {
      const nextState = {
        ...state,
        shared: {
          ...state.shared,
          language: "cs-CZ",
        },
      };
      const messages = selectors.getI18nMessages(nextState);
      expect(messages).toMatchObject({});
      expect(selectors.getI18nMessages(nextState)).toEqual(messages);
    });
  });
});
