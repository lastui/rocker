import { matchPath } from "..";

describe("routing", () => {
  describe("matchPath", () => {
    it("empty", () => {
      const result = matchPath("/a/b/c", "");
      expect(result.isExact).toEqual(false);
      expect(result.params).toEqual({});
      expect(result.path).toEqual("");
      expect(result.url).toEqual("/");
    });

    it("all", () => {
      const result = matchPath("/a/b/c", "*");
      expect(result.isExact).toEqual(true);
      expect(result.params).toEqual({
        "*": "a/b/c",
      });
      expect(result.path).toEqual("*");
      expect(result.url).toEqual("/a/b/c");
    });

    it("root then all", () => {
      const result = matchPath("/a/b/c", "/*");
      expect(result.isExact).toEqual(true);
      expect(result.params).toEqual({
        "*": "a/b/c",
      });
      expect(result.path).toEqual("/*");
      expect(result.url).toEqual("/a/b/c");
    });

    it("start then all", () => {
      const result = matchPath("/a/b/c", "/a/*");
      expect(result.isExact).toEqual(true);
      expect(result.params).toEqual({
        "*": "b/c",
      });
      expect(result.path).toEqual("/a/*");
      expect(result.url).toEqual("/a/b/c");
    });

    it("params", () => {
      const result = matchPath("/a/b/c", "/a/:partition/:variable");
      expect(result.isExact).toEqual(true);
      expect(result.params).toEqual({
        partition: "b",
        variable: "c",
      });
      expect(result.path).toEqual("/a/:partition/:variable");
      expect(result.url).toEqual("/a/b/c");
    });

    it("params with malformed value", () => {
      const result = matchPath("/%", "/:partition");
      expect(result.isExact).toEqual(true);
      expect(result.params).toEqual({
        partition: "%",
      });
      expect(result.path).toEqual("/:partition");
      expect(result.url).toEqual("/%");
    });

    it("short match", () => {
      const result = matchPath("/a/b/c", "/a/:partition");
      expect(result.isExact).toEqual(false);
      expect(result.params).toEqual({
        partition: "b",
      });
      expect(result.path).toEqual("/a/:partition");
      expect(result.url).toEqual("/a/b");
    });

    it("short match requested exact match", () => {
      const result = matchPath("/a/b/c", "/a/:partition", true);
      expect(result).toEqual(null);
    });

    it("long match", () => {
      const result = matchPath("/a/b/c", "/a/:partition/c/d");
      expect(result).toEqual(null);
    });
  });
});