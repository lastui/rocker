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
      view: (props) => <div data-testid="happy-component">{props.children}</div>,
    };
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

    render(
      <ReduxProvider store={store}>
        <Module name="my-feature" />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
  });

  it("renders children of loaded module", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    render(
      <ReduxProvider store={store}>
        <Module name="my-feature">
          <div data-testid="happy-child" />
        </Module>
      </ReduxProvider>,
    );

    expect(screen.getByTestId("happy-component")).toBeInTheDocument();
    expect(screen.getByTestId("happy-child")).toBeInTheDocument();
  });

  it("renders nothing if module not ready", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": false,
        },
      },
    });

    render(
      <ReduxProvider store={store}>
        <Module name="my-feature" />
      </ReduxProvider>,
    );
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
        <Module name="my-feature-without-view" />
      </ReduxProvider>,
    );

    unmount();
  });

  it("renders fallback while still loading", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {
          "my-feature": false,
        },
      },
    });

    render(
      <ReduxProvider store={store}>
        <Module name="my-feature" fallback={() => <div data-testid="pending-fallback" />} />
      </ReduxProvider>,
    );

    expect(screen.getByTestId("pending-fallback")).toBeInTheDocument();
  });

  it("renders nothing if there is no module name provided", () => {
    const store = configureStore([])({
      shared: {
        readyModules: {},
      },
    });

    render(
      <ReduxProvider store={store}>
        <Module />
      </ReduxProvider>,
    );
  });
});