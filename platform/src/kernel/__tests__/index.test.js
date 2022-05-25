import * as all from "../";

describe("kernel module exports", () => {
  it("should expose fixed number of things", () => {
    expect(Object.keys(all).length).toEqual(19);
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

  describe("constants", () => {
    it("exposes expected", () => {
      expect(Object.keys(all.constants).length).toEqual(14);
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

  describe("hooks", () => {
    it("exposes expected", () => {
      expect(all.useLocation).toBeDefined();
      expect(all.useParams).toBeDefined();
      expect(all.useRouteMatch).toBeDefined();
      expect(all.useHistory).toBeDefined();
    });
  });

  describe("components", () => {
    it("exposes expected", () => {
      expect(all.Module).toBeDefined();
      expect(all.Link).toBeDefined();
      expect(all.Router).toBeDefined();
      expect(all.Route).toBeDefined();
      expect(all.Redirect).toBeDefined();
    });
  });
});