import { warning } from "../utils";

describe("utils", () => {
  describe("warning", () => {
    it("without throwable", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      warning("crash");
      expect(spy).toHaveBeenCalledWith("crash");
    });

    it("with throwable", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const error = new Error("stack");
      warning("crash", error);
      expect(spy).toHaveBeenCalledWith("crash", error);
    });
  });
});
