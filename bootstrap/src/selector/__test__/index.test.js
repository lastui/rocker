import * as selectors from "..";

describe("selector", () => {
  let state = null;

  beforeEach(() => {
    global.DEFAULT_LOCALE = "en-US";
    state = {
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
  });

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
      expect(messages.miss).toBeUndefined();
    });

    it("should fallback on DEFAULT_LOCALE when it is missing in current locale", () => {
      state.env.language = "fr-FR";
      const messages = selectors.getI18nMessages(state);
      expect(messages.foo).toEqual(state.env.messages["en-US"].foo);
    });

    it("should work properly when no messages exist at all", () => {
      delete state.env.messages;
      const messages = selectors.getI18nMessages(state);
      expect(messages.foo).toBeUndefined();
    });
  });
});
