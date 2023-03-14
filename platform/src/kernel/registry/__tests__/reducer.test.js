import { addReducer, removeReducer } from "../reducer";

jest.mock("../../reducer/modules", () => ({
  modulesReducers: {},
}));

describe("reducer registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  beforeEach(() => {
    debugSpy.mockClear();
  });

  it("addReducer", async () => {
    await addReducer("my-feature", { foo: (state = {}, _action) => state });
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature introducing reducer");

    await addReducer("my-feature", { foo: (state = {}, _action) => state });
    expect(debugSpy).toHaveBeenLastCalledWith("module my-feature replacing reducer");

    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    await addReducer("my-feature", {
      bar: (_state, _action) => {
        throw "ouch";
      },
    });
    expect(spy).toHaveBeenCalledWith("module my-feature wanted to register invalid reducer", "ouch");
  });

  it("removeReducer", async () => {
    await addReducer("my-feature", { foo: (state = {}, _action) => state });

    removeReducer("my-feature");

    expect(debugSpy).toHaveBeenCalledWith("module my-feature removing reducer");
    debugSpy.mockClear();

    removeReducer("my-feature");

    expect(debugSpy).not.toHaveBeenCalled();
  });
});
