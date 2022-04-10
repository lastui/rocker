import { render, screen, waitFor } from "@testing-library/react";
import { constants } from "@lastui/rocker/platform";

import configureStore from "redux-mock-store";

const mockStore = configureStore([])({
  runtime: {
    entrypoint: "some-entrypoint",
  },
  shared: {
    language: "en-US",
    messages: {},
  },
});

jest.mock("../../store", () => async (fetchContext) => {
  await fetchContext();
  return mockStore;
});

import Main from "../Main";

describe("<Main />", () => {
  const consoleDebug = console.warn;

  beforeEach(() => {
    console.debug = jest.fn();
  });

  afterAll(() => {
    console.debug = consoleDebug;
  });

  it("should bootstrap", async () => {
    const initializeRuntime = jest.fn();
    const fetchContext = jest.fn();
    render(
      <Main
        contextRefreshInterval={10}
        fetchContext={fetchContext}
        initializeRuntime={initializeRuntime}
      />
    );
    await waitFor(() => {
      expect(console.debug).toHaveBeenCalledWith("bootstraping runtime");
      const entrypointModule = screen.getByTestId("module/some-entrypoint");
      expect(entrypointModule).toBeDefined();
      expect(fetchContext).toHaveBeenCalled();
      const actions = mockStore.getActions();
      expect(actions.length).toEqual(1);
      expect(actions[0].type).toEqual(constants.INIT);
      expect(actions[0].payload.initializeRuntime).toEqual(initializeRuntime);
      expect(actions[0].payload.contextRefreshInterval).toEqual(10);
    });
  });

  it("should propagate bootstrap failure to error boundaries", async () => {
    const fetchContext = jest.fn(() => { throw new Error('error') });
    render(
      <Main
        contextRefreshInterval={10}
        fetchContext={fetchContext}
      />
    );
    try {
      await waitFor(() => {
        expect(console.debug).toHaveBeenCalledWith("bootstraping runtime");
        expect(fetchContext).toHaveBeenCalled();
      });
      expect(false).toEqual('error not thrown');
    } catch (error) {
      // success
    }
  });

});
