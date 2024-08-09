import configureStore from "redux-mock-store";
import { runSaga, stdChannel } from "redux-saga";
import { take } from "redux-saga/effects";

import * as constants from "../../../constants";
import { addSaga, removeSaga, setSagaRunner } from "../saga";

describe("saga registry", () => {
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  const channel = stdChannel();

  beforeEach(() => {
    errorSpy.mockClear();
    setSagaRunner((store, saga) =>
      runSaga(
        {
          context: {},
          channel,
          dispatch: store.dispatch,
          getState: store.getState,
        },
        saga,
      ),
    );
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it("setSagaRunner", () => {
    setSagaRunner(() => {});
    setSagaRunner(null);
  });

  it("addSaga", async () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    await addSaga("my-feature", store, function* () {
      yield take("never-happens");
    });

    await addSaga("my-feature", store, function* () {
      throw new Error("ouch");
    });

    expect(errorSpy).toHaveBeenCalledWith("module my-feature saga crashed", new Error("ouch"));

    await addSaga("my-other-feature", store, function* () {
      yield take("this-is-stale");
    });

    channel.put({ type: constants.MODULE_INIT, payload: { module: "my-feature" } });
    channel.put({ type: constants.MODULE_INIT, payload: { module: "my-other-feature" } });

    setSagaRunner(null);

    await addSaga("my-other-feature", store, function* () {
      throw new Error("unused");
    });

    expect(errorSpy).toHaveBeenCalledWith("Sagas runnner is not provided!");
  });

  it("removeSaga", async () => {
    const store = configureStore([])({
      env: {
        readyModules: {
          "my-feature": true,
        },
      },
    });

    await addSaga("my-feature", store, function* () {
      yield take("never-happens");
    });

    removeSaga("my-feature", store);
    removeSaga("my-feature", store);
  });
});
