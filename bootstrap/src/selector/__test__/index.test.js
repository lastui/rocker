import * as selectors from "..";

describe("selector", () => {
  const state = {
    runtime: {
      entrypoint: "value",
    },
    env: {
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
    it("should return a structure supporting getting i18n keys", () => {
      const messages = selectors.getI18nMessages(state);
      expect(messages.foo).toEqual(state.env.messages["en-US"].foo);
      expect(messages.miss).not.toBeDefined();
    });
  });
});
