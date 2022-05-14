import { render, screen, cleanup } from "@testing-library/react";

import Redirect from "../Redirect";
import { RouterContext, HistoryContext } from "../Router";

describe("<Redirect />", () => {
  const history = {
    replace: jest.fn(),
  };

  const Setup = (props) => (
    <RouterContext.Provider
      value={{
        location: {
          pathname: "/a",
        },
        match: {
          path: "/",
          url: "/",
          parent: "",
          params: {},
          isExact: true,
        },
      }}>
      <HistoryContext.Provider value={history}>{props.children}</HistoryContext.Provider>
    </RouterContext.Provider>
  );

  afterEach(() => {
    history.replace.mockClear();
    cleanup();
  });

  it("performs redirect", () => {
    render(
      <Setup>
        <Redirect from="/a" to="/b" />
      </Setup>,
    );

    expect(history.replace).toHaveBeenCalledWith("/b");
  });

  it("does not perform redirect", () => {
    render(
      <Setup>
        <Redirect from="/b" to="/a" />
      </Setup>,
    );

    expect(history.replace).not.toHaveBeenCalled();
  });
});