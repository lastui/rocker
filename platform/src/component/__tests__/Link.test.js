import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Link from "../Link";
import { RouterContext, HistoryContext } from "../Router";

describe("<Link />", () => {
  const history = {
    replace: jest.fn(),
    push: jest.fn(),
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
    history.push.mockClear();
    cleanup();
  });

  it("performs navigation when clicked", async () => {
    render(
      <Setup>
        <Link to="/b" />
      </Setup>,
    );

    await userEvent.click(screen.getByRole("link"));

    expect(history.push).toHaveBeenCalledWith("/b");
  });

  it("performs replace of history when clicked", async () => {
    render(
      <Setup>
        <Link replace to="/b" />
      </Setup>,
    );

    await userEvent.click(screen.getByRole("link"));

    expect(history.replace).toHaveBeenCalledWith("/b");
  });

  it("supports custom link component", async () => {
    render(
      <Setup>
        <Link to="/b" component={(linkProps) => <span role="link" tabIndex={0} onClick={linkProps.navigate} />} />
      </Setup>,
    );

    await userEvent.click(screen.getByRole("link"));

    expect(history.push).toHaveBeenCalledWith("/b");
  });

  describe("supports onClick handler", () => {
    it("calls handler", async () => {
      const onClick = jest.fn();

      render(
        <Setup>
          <Link replace to="/b" onClick={onClick} target="_self" />
        </Setup>,
      );

      await userEvent.click(screen.getByRole("link"));

      expect(history.replace).toHaveBeenCalledWith("/b");
      expect(onClick).toHaveBeenCalled();
    });

    it("does not swallow errors", async () => {
      const onClick = jest.fn();
      onClick.mockImplementationOnce(() => {
        throw "ouch";
      });

      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      spy.mockClear();

      render(
        <Setup>
          <Link replace to="/b" onClick={onClick} />
        </Setup>,
      );

      await userEvent.click(screen.getByRole("link"));

      expect(onClick).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith("onClick handler of Link component errored", "ouch");
    });
  });

  it("navigates relatively", async () => {
    render(
      <Setup>
        <Link to="b" />
      </Setup>,
    );

    await userEvent.click(screen.getByRole("link"));

    expect(history.push).toHaveBeenCalledWith("/b");
  });

  it("supports children", async () => {
    render(
      <Setup>
        <Link to="/b">
          <div data-testid="happy-child" />
        </Link>
      </Setup>,
    );

    await userEvent.click(screen.getByRole("link"));

    expect(history.push).toHaveBeenCalledWith("/b");

    expect(screen.getByTestId("happy-child")).toBeInTheDocument();
  });
});