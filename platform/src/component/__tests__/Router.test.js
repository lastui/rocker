import { render, screen, cleanup } from "@testing-library/react";

import Router, { RouterContext, useLocation, useParams, useRouteMatch, useHistory } from "../Router";

describe("<Router />", () => {
  const history = {
    listen: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    location: {
      pathname: "/a/b",
    },
  };

  afterEach(() => {
    history.listen.mockClear();
    history.push.mockClear();
    history.replace.mockClear();
    cleanup();
  });

  it("provides root routing context", () => {
    render(
      <Router history={history}>
        <RouterContext.Consumer>
          {(context) => {
            if (context.location.pathname !== history.location.pathname) {
              return null;
            }
            return <div data-testid="happy-component" />;
          }}
        </RouterContext.Consumer>
      </Router>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("does not need children", () => {
    render(<Router history={history} />);
  });

  describe("hooks", () => {
    const initHook = (hook) => {
      let result = null;
      const EscapeHatch = () => {
        result = hook();
        return null;
      };
      render(
        <Router history={history}>
          <EscapeHatch />
        </Router>,
      );
      return result;
    };

    it("useLocation", () => {
      expect(initHook(() => useLocation())).toEqual({ pathname: "/a/b" });
    });

    it("useParams", () => {
      expect(initHook(() => useParams())).toEqual({});
    });

    it("useRouteMatch", () => {
      expect(initHook(() => useRouteMatch())).toEqual({
        isExact: false,
        params: {},
        parent: "",
        path: "/",
        url: "/",
      });

      expect(initHook(() => useRouteMatch("/a/:variable"))).toEqual({
        isExact: true,
        params: {
          variable: "b",
        },
        path: "/a/:variable",
        url: "/a/b",
      });
    });

    it("useHistory", () => {
      const result = initHook(() => useHistory());

      expect(typeof result.push).toEqual("function");
      expect(typeof result.replace).toEqual("function");

      result.push("/a");
      expect(history.push).toHaveBeenCalledWith("/a");

      result.push("a");
      expect(history.push).toHaveBeenCalledWith("/a");

      result.replace("/a");
      expect(history.replace).toHaveBeenCalledWith("/a");

      result.replace("a");
      expect(history.replace).toHaveBeenCalledWith("/a");
    });
  });
});