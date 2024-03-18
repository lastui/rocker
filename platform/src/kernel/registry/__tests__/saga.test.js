import configureStore from "redux-mock-store";
import { runSaga, stdChannel } from "redux-saga";
import { take } from "redux-saga/effects";

import * as constants from "../../../constants";
import { addSaga, removeSaga, setSagaRunner } from "../saga";

describe("saga registry", () => {
  const debugSpy = jest.spyOn(console, "debug");
  debugSpy.mockImplementation(() => {});

  const channel = stdChannel();

  beforeEach(() => {
    debugSpy.mockClear();
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

  it("setSagaRunner", () => {
    setSagaRunner(() => {});
    setSagaRunner(null);
  });

  it("addSaga", async () => {
    const spy = jest.spyOn(console, "error");
    spy.mockImplementation(() => {});

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
    expect(debugSpy).toHaveBeenCalledWith("module my-feature introducing saga");

    await addSaga("my-feature", store, function* () {
      throw new Error("ouch");
    });
    expect(debugSpy).toHaveBeenCalledWith("module my-feature replacing saga");
    expect(spy).toHaveBeenCalledWith("module my-feature saga crashed", new Error("ouch"));

    await addSaga("my-other-feature", store, function* () {
      yield take("this-is-stale");
    });

    channel.put({ type: constants.MODULE_INIT, payload: { module: "my-feature" } });
    channel.put({ type: constants.MODULE_INIT, payload: { module: "my-other-feature" } });

    setSagaRunner(null);

    await addSaga("my-other-feature", store, function* () {
      throw new Error("unused");
    });

    expect(spy).toHaveBeenCalledWith("Sagas runnner is not provided!");
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
    debugSpy.mockClear();

    removeSaga("my-feature", store);
    expect(debugSpy).toHaveBeenCalledWith("module my-feature removing saga");
    debugSpy.mockClear();

    removeSaga("my-feature", store);
    expect(debugSpy).not.toHaveBeenCalled();
  });
});
