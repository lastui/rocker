import { render, screen, cleanup } from "@testing-library/react";

import Route from "../Route";
import { RouterContext } from "../Router";

describe("<Route />", () => {
  const Setup = (props) => (
    <RouterContext.Provider
      value={{
        location: {
          pathname: props.pathname,
        },
        match: {
          path: props.path,
          url: props.url,
          parent: "",
          params: {},
          isExact: false,
        },
      }}>
      {props.children}
    </RouterContext.Provider>
  );

  afterEach(() => {
    cleanup();
  });

  describe("renders nothing", () => {
    it("no component", () => {
      render(<Route index />);
    });

    it("no index and no path", () => {
      render(<Route component={() => <div />} />);
    });
  });

  it("requires RouterContext to be present", () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});
    spy.mockClear();

    render(<Route index component={() => <div />} />);

    expect(spy).toHaveBeenCalledWith(
      "Router used outside of context, Entrypoint or Main is probably missing in parent tree of this component.",
    );
  });

  describe("branching", () => {
    it("leading match", () => {
      render(
        <Setup pathname="/x/y" path="/" url="/">
          <Route path="/" component={() => <div data-testid="happy-branch" />} />
        </Setup>,
      );

      expect(screen.getByTestId("happy-branch")).toBeInTheDocument();
    });

    it("index match", () => {
      render(
        <Setup pathname="/a/b" path="/a" url="/a/b">
          <Route index component={() => <div data-testid="happy-branch" />} />
        </Setup>,
      );

      expect(screen.getByTestId("happy-branch")).toBeInTheDocument();
    });

    it("no match", () => {
      render(
        <Setup pathname="/a/b" path="/a" url="/a/b">
          <Route path="/a/b/c" component={() => <div data-testid="happy-branch" />} />
        </Setup>,
      );

      expect(screen.queryByTestId("happy-branch")).not.toBeInTheDocument();
    });
  });
});