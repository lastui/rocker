import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import configureStore from "redux-mock-store";

import { withRedux } from "@lastui/rocker/test";

import Entrypoint from "../Entrypoint";

const initialState = {
  runtime: {
    entrypoint: null,
  },
  localisation: {},
};

const mockStore = configureStore([]);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = false;
  }

  static getDerivedStateFromError(_error) {
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

const BrokenComponent = () => {
  throw new Error("failure");
};

describe("<Entrypoint />", () => {
  beforeEach(() => {
    top.history.pushState(null, document.title, "/");
  });

  afterEach(() => {
    top.history.pushState(null, document.title, "/");
  });

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
    expect(screen.getByTestId("module/entrypoint")).toBeInTheDocument();
  });

  describe("routing", () => {
    it("matches properly", async () => {
      const store = mockStore({
        ...initialState,
        runtime: {
          entrypoint: "routing",
        },
      });

      const Template = (props) => (
        <ErrorBoundary>
          <Entrypoint>
            <Link to={props.href}>Navigate</Link>
            <Routes>
              <Route path="/grand">
                <Route path="parent">
                  <Route path="child" element={<span data-testid="RouteMatchLeft" />} />
                </Route>
              </Route>
              <Route path="/sibling" element={<span data-testid="RouteMatchRight" />} />
              <Route path="*" element={<span data-testid="RouteNoMatch" />} />
            </Routes>
          </Entrypoint>
        </ErrorBoundary>
      );

      const { rerender } = render(withRedux(<Template href="/404" />, store));

      await userEvent.click(screen.getByText("Navigate"));

      await waitFor(() => {
        expect(top.location.pathname).toBe("/404");
        expect(screen.getByTestId("RouteNoMatch")).toBeInTheDocument();
      });

      rerender(withRedux(<Template href="/grand/parent/child" />, store));

      await userEvent.click(screen.getByText("Navigate"));

      await waitFor(() => {
        expect(top.location.pathname).toBe("/grand/parent/child");
        expect(screen.getByTestId("RouteMatchLeft")).toBeInTheDocument();
      });

      rerender(withRedux(<Template href="/sibling" />, store));

      await userEvent.click(screen.getByText("Navigate"));

      await waitFor(() => {
        expect(top.location.pathname).toBe("/sibling");
        expect(screen.getByTestId("RouteMatchRight")).toBeInTheDocument();
      });
    });

    it("errorElement does not swallow errors", async () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const store = mockStore({
        ...initialState,
        runtime: {
          entrypoint: "routing",
        },
      });

      render(
        withRedux(
          <ErrorBoundary>
            <Entrypoint>
              <Link to="/parent/child">Navigate</Link>
              <Routes>
                <Route path="parent">
                  <Route path="child" element={<BrokenComponent />} />
                </Route>
              </Routes>
            </Entrypoint>
          </ErrorBoundary>,
          store,
        ),
      );

      await userEvent.click(screen.getByText("Navigate"));

      await waitFor(() => {
        expect(screen.getByTestId("EntrypointErrorBoundaries")).toBeInTheDocument();
      });

      spy.mockRestore();
    });
  });
});
