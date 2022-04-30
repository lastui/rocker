import setupStore from "../";

describe("store", () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  it("initialises properly", async () => {
    const fetchContext = jest.fn();
    const store = await setupStore(fetchContext);
    expect(store).toBeDefined();
    expect(fetchContext).toHaveBeenCalled();
  });

  it("accepts middlewares provided via bootstrap", async () => {
    const spy = jest.fn();
    const customMiddleware = (_store) => (next) => (action) => {
      spy(action);
      return next(action);
    };
    const fetchContext = jest.fn();
    const store = await setupStore(fetchContext, [customMiddleware]);
    expect(store).toBeDefined();

    const action = { type: "test-probe" };
    store.dispatch(action);
    expect(spy).toHaveBeenCalledWith(action);
  });

  it("contains @redux-devtools/extension in NODE_ENV=development", async () => {
    process.env.NODE_ENV = "development";
    const fetchContext = jest.fn();
    const store = await setupStore(fetchContext, []);
    expect(store).toBeDefined();
  });
});