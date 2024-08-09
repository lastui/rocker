import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import configureStore from "redux-mock-store";

import { withRedux } from "@lastui/rocker/test";

import Scoped from "../Scoped";

describe("Scoped", () => {
  const store = configureStore([])({});

  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    errorSpy.mockClear();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders given component", () => {
    const scope = {
      component: () => <div data-testid="happy-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View />, store));

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("passes scope props", () => {
    const scope = {
      component: (props) => <div {...props} />,
      props: {
        "data-testid": "happy-component",
      },
    };

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View />, store));

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("passes owned props", () => {
    const scope = {
      component: (props) => <div {...props} />,
    };

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View owned={{ "data-testid": "happy-component" }} />, store));

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("passes ref", () => {
    const scope = {
      component: React.forwardRef((props, ref) => <div data-testid="happy-component" ref={ref} />),
    };

    const ref = React.createRef();

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View ref={ref} />, store));

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
    expect(ref.current).toMatchInlineSnapshot(`
      <div
        data-testid="happy-component"
      />
    `);
  });

  it("passes children", () => {
    const scope = {
      component: (props) => <div data-testid="happy-component">{props.children}</div>,
    };

    const View = Scoped("my-feature", store, scope);

    render(
      withRedux(
        <View>
          <div data-testid="happy-child" />
        </View>,
        store,
      ),
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
    expect(screen.getByTestId("happy-child")).toBeInTheDocument();
  });

  it("has error boundaries", () => {
    const scope = {
      component: () => {
        throw new Error("ouch");
      },
    };

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View />, store));

    expect(errorSpy).toHaveBeenCalled();
  });

  it("has error boundaries with custom component", () => {
    const scope = {
      component: () => {
        throw new Error("ouch");
      },
      fallback: () => <div data-testid="sad-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    render(withRedux(<View />, store));

    expect(screen.getByTestId("sad-component")).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("updates properly", () => {
    const scope = {
      component: () => <div data-testid="happy-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    const { rerender } = render(withRedux(<View owned={{}} />, store));
    rerender(withRedux(<View owned={{}} isReady />, store));
    rerender(withRedux(<View owned={{}} isReady lastUpdate={2} />, store));
    rerender(withRedux(<View owned={{ boo: "fur" }} isReady lastUpdate={2} />, store));
    rerender(withRedux(<View owned={{ boo: "fur" }} isReady lastUpdate={2} />, store));

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });
});
