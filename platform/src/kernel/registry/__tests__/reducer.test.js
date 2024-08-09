import { addReducer, removeReducer } from "../reducer";

jest.mock("../../reducer/modules", () => ({
  modulesReducers: {},
}));

describe("reducer registry", () => {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    errorSpy.mockClear();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it("addReducer", async () => {
    await addReducer("my-feature", {
      foo: (state = {}, _action) => state,
    });

    await addReducer("my-feature", {
      foo: (state = {}, _action) => state,
    });

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
    removeReducer("my-feature");
  });
});
