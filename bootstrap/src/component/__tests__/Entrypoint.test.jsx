import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Entrypoint from "../Entrypoint";
import { withRedux } from "@lastui/rocker/test";
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
  it("entrypoint missing", () => {
    const store = mockStore(initialState);
    const { container } = render(withRedux(<Entrypoint />, store));
    expect(container).toBeEmptyDOMElement();
  });

  it("entrypoint present", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
    });
    render(withRedux(<Entrypoint />, store));
    expect(screen.getByTestId("module/entrypoint")).toBeDefined();
  });

  it("entrypoint missing", () => {
    const store = mockStore(initialState);

    const { container } = render(withRedux(<Entrypoint />, store));
    expect(container.innerHTML).toBe("");
  });

  describe("localisation", () => {
    it("is supported", () => {
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
        withRedux(
          <Entrypoint>
            <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
          </Entrypoint>,
          store,
        ),
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
        withRedux(
          <Entrypoint>
            <FormattedMessage id="non-existant" />
          </Entrypoint>,
          store,
        ),
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
        withRedux(
          <Entrypoint>
            <FormattedMessage id="non-existant" />
          </Entrypoint>,
          store,
        ),
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
        withRedux(
          <ErrorBoundary>
            <Entrypoint>
              <FormattedMessage id="existant" values={{ key: "K", value: "V" }} />
            </Entrypoint>
          </ErrorBoundary>,
          store,
        ),
      );

      await waitFor(() => {
        expect(screen.getByTestId("EntrypointErrorBoundaries")).toBeDefined();
      });

      spy.mockRestore();
    });
  });
});
