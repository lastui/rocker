import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Globalisation from "../Globalisation";
import { withRedux } from "@lastui/rocker/test";
import configureStore from "redux-mock-store";
import { FormattedMessage } from "react-intl";

const initialState = {
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
      return <span data-testid="GlobalisationErrorBoundaries" />;
    } else {
      return React.Children.only(this.props.children);
    }
  }
}

describe("<Globalisation />", () => {
  it("is supported", () => {
    const store = mockStore({
      ...initialState,
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
      withRedux(
        <Globalisation>
          <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
        </Globalisation>,
        store,
      ),
    );

    expect(screen.getByText("message with key K and value V")).toBeInTheDocument();
  });

  it("MISSING_TRANSLATION intl error is silenced", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
    });
    render(
      withRedux(
        <Globalisation>
          <FormattedMessage id="non-existant" />
        </Globalisation>,
        store,
      ),
    );
    expect(screen.getByText("non-existant")).toBeInTheDocument();
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
      withRedux(
        <Globalisation>
          <FormattedMessage id="non-existant" />
        </Globalisation>,
        store,
      ),
    );
    expect(screen.getByText("non-existant")).toBeInTheDocument();
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
      withRedux(
        <ErrorBoundary>
          <Globalisation>
            <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
          </Globalisation>
        </ErrorBoundary>,
        store,
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId("GlobalisationErrorBoundaries")).toBeInTheDocument();
    });

    spy.mockRestore();
  });
});
