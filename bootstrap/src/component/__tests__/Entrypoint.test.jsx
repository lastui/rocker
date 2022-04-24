import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Entrypoint from "../Entrypoint";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "redux-mock-store";
import { FormattedMessage } from "react-intl";

const initialState = {
  runtime: {
    entrypoint: null,
  },
  shared: {
    language: "en-US",
    messages: {},
  },
};

const mockStore = configureStore([]);

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
      return <span data-testid="EntrypointErrorBoundaries" />;
    } else {
      return React.Children.only(this.props.children);
    }
  }
}

describe("<Entrypoint />", () => {
  it("entrypoint present", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
    });
    render(
      <ReduxProvider store={store}>
        <Entrypoint />
      </ReduxProvider>,
    );
    expect(screen.getByTestId("module/entrypoint")).toBeDefined();
  });

  it("entrypoint missing", () => {
    const store = mockStore(initialState);

    const { container } = render(
      <ReduxProvider store={store}>
        <Entrypoint />
      </ReduxProvider>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("localisation is supported", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
      shared: {
        ...initialState.shared,
        messages: {
          "en-US": {
            existant: "message with key {key} and value {value}",
          },
        },
      },
    });

    render(
      <ReduxProvider store={store}>
        <Entrypoint>
          <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
        </Entrypoint>
      </ReduxProvider>,
    );

    expect(screen.getByText("message with key K and value V")).toBeDefined();
  });

  it("MISSING_TRANSLATION intl error is silenced", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
    });
    render(
      <ReduxProvider store={store}>
        <Entrypoint>
          <FormattedMessage id="non-existant" />
        </Entrypoint>
      </ReduxProvider>,
    );
    expect(screen.getByTestId("module/entrypoint")).toBeDefined();
  });

  it("MISSING_DATA intl error is silenced", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
      shared: {
        ...initialState.shared,
        language: "boo",
      },
    });
    render(
      <ReduxProvider store={store}>
        <Entrypoint>
          <FormattedMessage id="non-existant" />
        </Entrypoint>
      </ReduxProvider>,
    );
    expect(screen.getByTestId("module/entrypoint")).toBeDefined();
  });

  it("other intl errors not silenced", async () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
      shared: {
        ...initialState.shared,
        messages: {
          "en-US": {
            existant: "message with key {key and value {value}",
          },
        },
      },
    });

    render(
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <Entrypoint>
            <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
          </Entrypoint>
        </ReduxProvider>
      </ErrorBoundary>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("EntrypointErrorBoundaries")).toBeDefined();
    });

    spy.mockRestore();
  });
});