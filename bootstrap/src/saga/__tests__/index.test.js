import * as sagas from "../";

describe("saga", () => {
  it("exposes watchBootstrap", () => {
    expect(sagas.watchBootstrap).toBeDefined();
  });

  it("exposes watchFetchContext", () => {
    expect(sagas.watchFetchContext).toBeDefined();
  });

  it("exposes watchRefresh", () => {
    expect(sagas.watchRefresh).toBeDefined();
  });
});
