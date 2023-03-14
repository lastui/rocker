import configureStore from "redux-mock-store";
import { put } from "redux-saga/effects";

import createSagaMiddleware from "../saga";

describe("saga middleware ", () => {
  describe("createSagaMiddleware", () => {
    it("is function", () => {
      expect(typeof createSagaMiddleware).toEqual("function");
    });

    it("exposes runSaga and sagaMiddleware upon creation", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();
    });

    it("runSaga runs saga that is captured by sagaMiddleware", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();

      const store = configureStore([sagaMiddleware])({});
      const action = { type: "probe " };

      runSaga(store, function* () {
        yield put(action);
      });

      expect(store.getActions()).toEqual([action]);
    });
  });
});
