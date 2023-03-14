import * as all from "../";

describe("kernel module exports", () => {
  it("should expose fixed number of things", () => {
    expect(Object.keys(all).length).toEqual(12);
  });

  describe("setStore", () => {
    it("exposes expected", () => {
      expect(all.setStore).toBeDefined();
    });
  });

  describe("getStore", () => {
    it("exposes expected", () => {
      expect(all.getStore).toBeDefined();
    });
  });

  describe("registerModule", () => {
    it("exposes expected", () => {
      expect(all.registerModule).toBeDefined();
    });
  });

  describe("manualCleanup", () => {
    it("exposes expected", () => {
      expect(all.manualCleanup).toBeDefined();
    });
  });

  describe("constants", () => {
    it("exposes expected", () => {
      expect(Object.keys(all.constants).length).toEqual(13);
    });
  });

  describe("middleware", () => {
    it("exposes expected", () => {
      expect(all.createLoaderMiddleware).toBeDefined();
      expect(all.createDynamicMiddleware).toBeDefined();
      expect(all.createSagaMiddleware).toBeDefined();
    });
  });

  describe("reducers", () => {
    it("exposes expected", () => {
      expect(all.sharedReducer).toBeDefined();
      expect(all.modulesReducer).toBeDefined();
    });
  });

  describe("components", () => {
    it("exposes expected", () => {
      expect(all.Module).toBeDefined();
    });
  });
});
