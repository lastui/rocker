import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";
import configureStore from "redux-mock-store";

import { constants, setStore } from "@lastui/rocker/platform";

import Main from "../Main";

const initialState = {
  runtime: {
    entrypoint: "some-entrypoint",
    initialized: false,
  },
  shared: {
    language: null,
    messages: {},
  },
};

const mockStore = configureStore([])((actions) => {
  let state = initialState;
  for (const action of actions) {
    if (action.type === constants.INIT) {
      state = {
        runtime: {
          ...state.runtime,
          initialized: true,
        },
        shared: {
          ...state.shared,
        },
      };
    } else if (action.type === constants.SET_LANGUAGE) {
      state = {
        runtime: {
          ...state.runtime,
        },
        shared: {
          ...state.shared,
          language: action.payload.language,
        },
      };
    }
  }
  return state;
});

setStore(mockStore);

jest.mock("../../store", () => (fetchContext) => {
  fetchContext();
  return mockStore;
});

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
  beforeEach(() => {
    mockStore.clearActions();
  });

  it("should bootstrap", async () => {
    const fetchContext = jest.fn();
    render(<Main contextRefreshInterval={10} fetchContext={fetchContext} />);

    await waitFor(() => {
      expect(screen.getByTestId("module/some-entrypoint")).toBeInTheDocument();
      expect(fetchContext).toHaveBeenCalled();
    });

    const actions = mockStore.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual(constants.SET_LANGUAGE);
    expect(actions[0].payload.language).toEqual("en-US");
    expect(actions[1].type).toEqual(constants.INIT);
    expect(actions[1].payload.contextRefreshInterval).toEqual(10);
  });

  it("should use provided default locale", async () => {
    const fetchContext = jest.fn();
    render(<Main contextRefreshInterval={10} defaultLocale="fr-FR" fetchContext={fetchContext} />);
    await waitFor(() => {
      expect(screen.getByTestId("module/some-entrypoint")).toBeInTheDocument();
    });

    const actions = mockStore.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual(constants.SET_LANGUAGE);
    expect(actions[0].payload.language).toEqual("fr-FR");
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
      expect(fetchContext).toHaveBeenCalled();
      expect(screen.getByTestId("MainErrorBoundaries")).toBeInTheDocument();
    });

    spy.mockRestore();
  });
});
