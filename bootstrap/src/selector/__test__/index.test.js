import * as selectors from "..";

describe("selector", () => {
  let state = null;

  beforeEach(() => {
    state = {
      runtime: {
        entrypoint: "value",
      },
      localisation: {
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

  describe(".getI18nMessagesFacade", () => {
    it("should return function", () => {
      expect(typeof selectors.getI18nMessagesFacade("en-US")).toEqual("function");
    });

    it("should return a structure supporting getting i18n keys", () => {
      const messages = selectors.getI18nMessagesFacade("en-US")(state);
      expect(messages.foo).toEqual(state.localisation.messages["en-US"].foo);
      expect(messages.miss).toBeUndefined();
    });

    it("should fallback on default locale when it is missing in current locale", () => {
      state.localisation.language = "fr-FR";
      const messages = selectors.getI18nMessagesFacade("en-US")(state);
      expect(messages.foo).toEqual(state.localisation.messages["en-US"].foo);
    });
  });
});
