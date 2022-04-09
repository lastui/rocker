import { render, screen } from "@testing-library/react";
import Entrypoint from "../Entrypoint";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "redux-mock-store";

const initialState = {
  runtime: {
    entrypoint: null,
  },
  shared: {
    language: "en-US",
    messages: {},
  },
};

const mockStore = configureStore([]);

describe("<Entrypoint />", () => {

  it("entrypoint present", () => {
    const store = mockStore({
      ...initialState,
      runtime: {
        entrypoint: "entrypoint",
      },
    });
    render(
      <ReduxProvider store={store}>
        <Entrypoint />
      </ReduxProvider>
    );
    const entrypointModule = screen.getByTestId("module/entrypoint");
    expect(entrypointModule).toBeDefined();
  });

  it("entrypoint missing", () => {
    const store = mockStore(initialState);

    const { container } = render(
      <ReduxProvider store={store}>
        <Entrypoint />
      </ReduxProvider>
    );
    expect(container.innerHTML).toBe("");
  });
});
