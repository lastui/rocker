import setupStore from "..";

describe("store", () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  const fetchContext = jest.fn();
  const mockRouter = { navigate: jest.fn() };

  beforeAll(() => {
    mockRouter.navigate.mockClear();
    fetchContext.mockClear();
  });

  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    delete top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    delete global.BUILD_ID;
  });

  it("initialises properly", async () => {
    const store = await setupStore(mockRouter, fetchContext);
    expect(store).toBeDefined();

    expect(fetchContext).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it("accepts middlewares provided via bootstrap", async () => {
    const spy = jest.fn();
    const customMiddleware = (_store) => (next) => (action) => {
      spy(action);
      return next(action);
    };
    const store = await setupStore(mockRouter, fetchContext, [customMiddleware]);
    expect(store).toBeDefined();

    const action = { type: "test-probe" };
    store.dispatch(action);
    expect(spy).toHaveBeenCalledWith(action);
  });

  it("contains __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ in NODE_ENV=development", async () => {
    global.BUILD_ID = "xxx";
    top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jest.fn();
    top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__.mockReturnValue(() => {});
    process.env.NODE_ENV = "development";
    const fetchContext = jest.fn();
    const store = await setupStore(mockRouter, fetchContext, []);
    expect(store).toBeDefined();
    expect(top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__).toHaveBeenCalledWith(expect.objectContaining({ name: "rocker-xxx" }));
  });
});
