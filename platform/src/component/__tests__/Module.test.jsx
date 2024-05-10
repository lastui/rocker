import { render, screen, cleanup, act } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { withRedux } from "@lastui/rocker/test";

import Module from "../Module";

jest.mock("../../kernel/registry/loader", () => ({
  loadModule: async (id) => {
    if (id === "my-feature-without-view") {
      return true;
    }
    return false;
  },
  getLoadedModule: (id) => {
    if (id === "my-feature-without-view") {
      return {};
    }
    if (id === "my-loading-feature") {
      return undefined;
    }
    return {
      view: (props) => <div data-testid="view-probe">{props.children}</div>,
    };
  },
  isAvailable: (id) => {
    if (id === "my-feature-without-view") {
      return true;
    }
    if (id === "my-loading-feature") {
      return true;
    }
    if (id === "my-feature") {
      return true;
    }
    return false;
  },
  isModuleLoading: (id) => {
    if (id === "my-loading-feature") {
      return true;
    }
    return false;
  },
}));

describe("<Module />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it("renders loaded module component", () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    const { unmount } = render(withRedux(<Module name="my-feature" />, store));

    expect(screen.getByTestId("view-probe")).toBeInTheDocument();

    unmount();
  });

  it("renders children of loaded module", () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    const { unmount } = render(
      withRedux(
        <Module name="my-feature">
          <div data-testid="child-probe" />
        </Module>,
        store,
      ),
    );

    expect(screen.getByTestId("view-probe")).toBeInTheDocument();
    expect(screen.getByTestId("child-probe")).toBeInTheDocument();

    unmount();
  });

  it("renders nothing if module not ready", () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature": false,
        },
      },
    });

    const { unmount } = render(
      withRedux(
        <Module name="my-feature">
          <div data-testid="child-probe" />
        </Module>,
        store,
      ),
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders nothing if there is no view", async () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature-without-view": true,
        },
      },
    });

    const { unmount } = render(
      withRedux(
        <Module name="my-feature-without-view">
          <div data-testid="child-probe" />
        </Module>,
        store,
      ),
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders fallback while loading", () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-loading-feature": false,
        },
      },
    });

    const { unmount } = render(
      withRedux(<Module name="my-loading-feature" fallback={<div data-testid="progress-probe" />} />, store),
    );

    expect(screen.queryByTestId("progress-probe")).not.toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId("progress-probe")).toBeInTheDocument();

    unmount();
  });

  it("renders nothing if there is no module name provided", () => {
    const store = configureStore([])({
      env: {
        readyModules: {},
      },
    });

    const { unmount } = render(
      withRedux(
        <Module>
          <div data-testid="child-probe" />
        </Module>,
        store,
      ),
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders nothing if module is not available", () => {
    const store = configureStore([])({
      env: {
        readyModules: {},
      },
    });

    const { unmount } = render(
      withRedux(
        <Module name="module-that-is-not-available">
          <div data-testid="child-probe" />
        </Module>,
        store,
      ),
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });
});
