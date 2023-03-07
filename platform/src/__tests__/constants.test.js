import * as constants from "../constants";

describe("constants", () => {
  describe("public", () => {
    it("context", () => {
      expect(constants.REFRESH).toBeDefined();
    });

    it("i18n", () => {
      expect(constants.SET_LANGUAGE).toBeDefined();
    });

    it("shared data", () => {
      expect(constants.SET_SHARED).toBeDefined();
    });
  });

  describe("internal", () => {
    it("lifecycle", () => {
      expect(constants.INIT).toBeDefined();
    });
    it("context", () => {
      expect(constants.FETCH_CONTEXT).toBeDefined();
      expect(constants.SET_AVAILABLE_MODULES).toBeDefined();
      expect(constants.SET_ENTRYPOINT_MODULE).toBeDefined();
    });

    it("module", () => {
      expect(constants.LOAD_MODULE).toBeDefined();
      expect(constants.MODULE_INIT).toBeDefined();
      expect(constants.MODULE_LOADED).toBeDefined();
      expect(constants.MODULE_UNLOADED).toBeDefined();
      expect(constants.MODULE_READY).toBeDefined();
    });

    it("i18n", () => {
      expect(constants.I18N_MESSAGES_BATCH).toBeDefined();
    });
  });
});