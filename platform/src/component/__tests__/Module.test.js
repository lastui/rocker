import { render, screen, cleanup } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "redux-mock-store";

import moduleLoader from "../../kernel/registry/loader";
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
    return {
      view: (props) => <div data-testid="view-probe">{props.children}</div>,
    };
  },
  isAvailable: (id) => {
    if (id === "my-feature-without-view") {
      return true;
    }
    if (id === "my-feature") {
      return true;
    }
    return false;
  },
}));

describe("<Module />", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders loaded module component", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="my-feature" />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("view-probe")).toBeInTheDocument();

    unmount();
  });

  it("renders children of loaded module", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="my-feature">
          <div data-testid="child-probe" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.getByTestId("view-probe")).toBeInTheDocument();
    expect(screen.getByTestId("child-probe")).toBeInTheDocument();

    unmount();
  });

  it("renders nothing if module not ready", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": false,
        },
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="my-feature">
          <div data-testid="child-probe" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders nothing if there is no view", async () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature-without-view": true,
        },
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="my-feature-without-view">
          <div data-testid="child-probe" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders fallback while loading", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": false,
        },
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="my-feature" fallback={() => <div data-testid="pending-fallback" />} />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("pending-fallback")).toBeInTheDocument();

    unmount();
  });

  it("renders nothing if there is no module name provided", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {},
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module>
          <div data-testid="child-probe" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("renders nothing if module is not available", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {},
      },
    });

    const { unmount } = render(
      <ReduxProvider store={store}>
        <Module name="module-that-is-not-available">
          <div data-testid="child-probe" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });
});