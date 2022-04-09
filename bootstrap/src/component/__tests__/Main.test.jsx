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

jest.mock("../../store", () => async () => mockStore);

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
    const fetchContext = jest.fn();
    const initializeRuntime = jest.fn();
    render(
      <Main
        fetchContext={fetchContext}
        contextRefreshInterval={10}
        initializeRuntime={initializeRuntime}
      />
    );
    await waitFor(() => {
      expect(console.debug).toHaveBeenCalledWith("bootstraping runtime");
      const entrypointModule = screen.getByTestId("module/some-entrypoint");
      expect(entrypointModule).toBeDefined();
      const actions = mockStore.getActions();
      expect(actions.length).toEqual(1);
      expect(actions[0].type).toEqual(constants.INIT);
      expect(actions[0].payload.fetchContext).toEqual(fetchContext);
      expect(actions[0].payload.initializeRuntime).toEqual(initializeRuntime);
      expect(actions[0].payload.contextRefreshInterval).toEqual(10);
    });
  });
});
