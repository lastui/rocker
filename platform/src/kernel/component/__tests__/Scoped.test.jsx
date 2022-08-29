import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "redux-mock-store";

import Scoped from "../Scoped";

describe("Scoped", () => {
  const store = configureStore([])({});

  const spyError = jest.spyOn(console, "error");
  spyError.mockImplementation(() => {});

  beforeEach(() => {
    spyError.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders given component", () => {
    const scope = {
      component: () => <div data-testid="happy-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View />
      </ReduxProvider>,
    );

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

    render(
      <ReduxProvider store={store}>
        <View />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("passes owned props", () => {
    const scope = {
      component: (props) => <div {...props} />,
    };

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View owned={{ "data-testid": "happy-component" }} />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("passes ref", () => {
    const scope = {
      component: React.forwardRef((props, ref) => <div data-testid="happy-component" ref={ref} />),
    };

    const ref = React.createRef();

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View ref={ref} />
      </ReduxProvider>,
    );

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

    const ref = React.createRef();

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View>
          <div data-testid="happy-child" />
        </View>
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
    expect(screen.getByTestId("happy-child")).toBeInTheDocument();
  });

  it("has error boundaries", () => {
    const scope = {
      component: () => {
        throw "ouch";
      },
    };

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View />
      </ReduxProvider>,
    );

    expect(spyError).toHaveBeenCalled();
  });

  it("has error boundaries with custom component", () => {
    const scope = {
      component: () => {
        throw "ouch";
      },
      fallback: () => <div data-testid="sad-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    render(
      <ReduxProvider store={store}>
        <View />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("sad-component")).toBeInTheDocument();
    expect(spyError).toHaveBeenCalled();
  });

  it("updates properly", () => {
    const scope = {
      component: () => <div data-testid="happy-component" />,
    };

    const View = Scoped("my-feature", store, scope);

    const { rerender } = render(
      <ReduxProvider store={store}>
        <View owned={{}} />
      </ReduxProvider>,
    );

    rerender(
      <ReduxProvider store={store}>
        <View owned={{}} isReady />
      </ReduxProvider>,
    );

    rerender(
      <ReduxProvider store={store}>
        <View owned={{}} isReady lastUpdate={2} />
      </ReduxProvider>,
    );

    rerender(
      <ReduxProvider store={store}>
        <View owned={{ boo: "fur" }} isReady lastUpdate={2} />
      </ReduxProvider>,
    );

    rerender(
      <ReduxProvider store={store}>
        <View owned={{ boo: "fur" }} isReady lastUpdate={2} />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });
});