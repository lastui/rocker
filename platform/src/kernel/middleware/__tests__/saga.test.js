import configureStore from "redux-mock-store";
import { put, take, all } from "redux-saga/effects";

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
      store.wrap = (type) => `test_${type}`;

      runSaga(store, function* () {
        yield put({ type: "probe" });
      });

      expect(store.getActions()).toEqual([{ type: "test_probe" }]);
    });

    describe("intercepts", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();

      const store = configureStore([sagaMiddleware])({});

      store.wrap = (type) => (!type || type.startsWith("@@") ? type : `test_${type}`);

      beforeEach(() => {
        store.clearActions();
      });

      it("call()", () => {
        runSaga(store, function* () {
          yield all([]);
        });
      });

      it("put({})", () => {
        runSaga(store, function* () {
          yield put({ type: undefined });
        });
        expect(store.getActions()).toEqual([]);
      });

      it("put({ type: '@@BROADCAST/THING' })", () => {
        runSaga(store, function* () {
          yield put({ type: "@@BROADCAST/THING" });
        });
        expect(store.getActions()).toEqual([{ type: "@@BROADCAST/THING" }]);
      });

      it("put({ type: 'THING' })", () => {
        runSaga(store, function* () {
          yield put({ type: "THING" });
        });
        expect(store.getActions()).toEqual([{ type: "test_THING" }]);
      });

      it("take('*')", () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take());
          sniff.push(yield take("*"));
        });

        store.dispatch({ type: "probe-1" });
        store.dispatch({ type: "probe-2" });
        expect(sniff).toEqual([{ type: "probe-1" }, { type: "probe-2" }]);
      });

      it("take('REQUEST')", () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take("REQUEST"));
        });

        store.dispatch({ type: "test_REQUEST" });
        expect(sniff).toEqual([{ type: "test_REQUEST" }]);
      });

      it("take(['REQUEST'])", () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take(["REQUEST"]));
        });

        store.dispatch({ type: "test_REQUEST" });
        expect(sniff).toEqual([{ type: "test_REQUEST" }]);
      });

      it("take(() => true)", () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take(() => true));
        });

        store.dispatch({ type: "test_REQUEST" });
        expect(sniff).toEqual([]);
      });
    });
  });
});
