import * as all from "..";

describe("safe module exports", () => {
  it("should expose fixed number of things", () => {
    expect(Object.keys(all).length).toEqual(4);
  });

  describe("registerModule", () => {
    it("exposes expected", () => {
      expect(all.registerModule).toBeDefined();
    });
  });

  describe("actions", () => {
    it("exposes expected", () => {
      expect(Object.keys(all.actions).length).toEqual(3);
      expect(all.actions.setLanguage).toBeDefined();
      expect(all.actions.setShared).toBeDefined();
      expect(all.actions.refresh).toBeDefined();
    });

    it(".setLanguage", () => {
      expect(all.actions.setLanguage("foo")).toEqual({
        type: "@@platform/SET_LANGUAGE",
        payload: {
          language: "foo",
        },
      });
    });

    it(".setShared", () => {
      expect(all.actions.setShared({ foo: "bar" })).toEqual({
        type: "@@shared/SET_SHARED",
        payload: {
          data: {
            foo: "bar",
          },
          module: true,
        },
      });
    });

    it(".refresh", () => {
      expect(all.actions.refresh()).toEqual({
        type: "@@platform/REFRESH",
      });
    });
  });

  describe("components", () => {
    it("exposes expected", () => {
      expect(all.Module).toBeDefined();
    });
  });
});
