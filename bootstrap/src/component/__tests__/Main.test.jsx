import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { constants, setStore } from "@lastui/rocker/platform";

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

setStore(mockStore);

jest.mock("../../store", () => (fetchContext) => {
  fetchContext();
  return mockStore;
});

import Main from "../Main";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = false;
  }

  static getDerivedStateFromError(error) {
    return true;
  }

  render() {
    if (this.state) {
      return <span data-testid="MainErrorBoundaries" />;
    } else {
      return React.Children.only(this.props.children);
    }
  }
}

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
    render(<Main contextRefreshInterval={10} fetchContext={fetchContext} />);
    await waitFor(() => {
      expect(console.debug).toHaveBeenCalledWith("bootstraping runtime");
      const entrypointModule = screen.getByTestId("module/some-entrypoint");
      expect(entrypointModule).toBeDefined();
      expect(fetchContext).toHaveBeenCalled();
      const actions = mockStore.getActions();
      expect(actions.length).toEqual(1);
      expect(actions[0].type).toEqual(constants.INIT);
      expect(actions[0].payload.contextRefreshInterval).toEqual(10);
    });
  });

  it("should propagate bootstrap failure to error boundaries", async () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    const fetchContext = jest.fn(() => {
      throw new Error("bootstrap error");
    });
    render(
      <ErrorBoundary>
        <Main contextRefreshInterval={10} fetchContext={fetchContext} />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(console.debug).toHaveBeenCalledWith("bootstraping runtime");
      expect(fetchContext).toHaveBeenCalled();
      expect(screen.getByTestId("MainErrorBoundaries")).toBeDefined();
    });

    spy.mockRestore();
  });
});