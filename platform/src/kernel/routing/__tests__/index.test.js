import { compilePath, matchPath } from "../";

describe("routing", () => {
  describe("compilePath", () => {
    it("should be defined", () => {
      expect(compilePath).toBeDefined();
    });
  });

  describe("matchPath", () => {
    it("should be defined", () => {
      expect(matchPath).toBeDefined();
    });
  });
});
