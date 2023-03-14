import { addStyles, removeStyles } from "../css";

describe("css registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
  });

  describe("addStyles", () => {
    beforeEach(() => {
      const node = document.createElement("style");
      node.setAttribute("id", "rocker-NODE_ID");
      node.setAttribute("data-testid", "dangling-styles");
      document.head.appendChild(node);
    });

    afterEach(() => {
      document.querySelector('style[data-testid="dangling-styles"]').remove();
    });

    it("expected DOM node exists", async () => {
      await addStyles("my-feature", "NODE_ID");

      expect(debugSpy).toHaveBeenCalledWith("module my-feature introducing styles");
      expect(document.querySelector('style[data-module="my-feature"]')).toBeDefined();
    });

    it("expected DOM node does not exist", async () => {
      await addStyles("my-feature", "non-existant-id");

      expect(debugSpy).not.toHaveBeenCalled();
    });
  });

  describe("removeStyles", () => {
    beforeEach(() => {
      const node = document.createElement("style");
      node.setAttribute("data-module", "my-feature");
      node.setAttribute("data-testid", "dangling-styles");
      document.head.appendChild(node);
    });

    afterEach(() => {
      const node = document.querySelector('style[data-testid="dangling-styles"]');
      if (node) {
        node.remove();
      }
    });

    it("expected DOM node exists", () => {
      removeStyles("my-feature");

      expect(debugSpy).toHaveBeenCalledWith("module my-feature removing styles");
      expect(document.querySelector('style[data-module="my-feature"]')).toEqual(null);
    });

    it("expected DOM node does not exist", () => {
      removeStyles("my-other-feature");

      expect(debugSpy).not.toHaveBeenCalled();
      expect(document.querySelector('style[data-module="my-feature"]')).toBeDefined();
    });
  });
});
