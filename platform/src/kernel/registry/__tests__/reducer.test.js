import { addReducer, removeReducer } from "../reducer";

jest.mock("../../reducer/modules", () => ({
  modulesReducers: {},
}));

describe("reducer registry", () => {
  const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    debugSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("addReducer", async () => {
    await addReducer("my-feature", {
      foo: (state = {}, _action) => state,
    });
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature introducing reducer");

    await addReducer("my-feature", {
      foo: (state = {}, _action) => state,
    });
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature replacing reducer");

    await addReducer("my-feature", {
      bar: (_state, _action) => {
        throw new Error("ouch");
      },
    });
    expect(errorSpy).toHaveBeenCalledWith("module my-feature wanted to register invalid reducer", new Error("ouch"));
  });

  it("removeReducer", async () => {
    await addReducer("my-feature", {
      foo: (state = {}, _action) => state,
    });

    removeReducer("my-feature");

    expect(debugSpy).toHaveBeenCalledWith("module my-feature removing reducer");
    debugSpy.mockClear();

    removeReducer("my-feature");

    expect(debugSpy).not.toHaveBeenCalled();
  });
});
