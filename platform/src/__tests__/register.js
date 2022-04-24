import registerModule from "../register";

describe("registerModule", () => {
  it("should be synchronous function", () => {
    expect(typeof registerModule).toEqual("function");
    expect(registerModule.constructor.name).toEqual("Function");
  });
});
