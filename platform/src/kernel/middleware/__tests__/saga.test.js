import configureStore from "redux-mock-store";
import { put, take, fork, cancel, all } from "redux-saga/effects";

import createSagaMiddleware from "../saga";

describe("saga middleware ", () => {
  describe("createSagaMiddleware", () => {
    it("is function", () => {
      expect(typeof createSagaMiddleware).toEqual("function");
    });

    it("exposes runSaga and sagaMiddleware upon creation", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();

      expect(runSaga).toBeDefined();
      expect(sagaMiddleware).toBeDefined();
    });

    it("runSaga runs saga that is captured by sagaMiddleware", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();

      const store = configureStore([sagaMiddleware])({});
      store.wrap = (type) => `test_${type}`;
      store.unwrap = (type) => type.slice(5);

      runSaga(store, function* () {
        yield put({ type: "probe" });
      });

      expect(store.getActions()).toEqual([{ type: "test_probe" }]);
    });

    describe("intercepts effects", () => {
      const { runSaga, sagaMiddleware } = createSagaMiddleware();

      const store = configureStore([sagaMiddleware])({});

      store.wrap = (type) => (!type || type.startsWith("@@") ? type : `test_${type}`);
      store.unwrap = (type) => (type && type.startsWith("test_") ? type.slice(5) : type);

      beforeEach(() => {
        store.clearActions();
      });

      it("all([])", () => {
        runSaga(store, function* () {
          yield all([]);
        });
      });

      it("cancel()", () => {
        runSaga(store, function* () {
          const task = yield fork(function* () {
            yield take("NEVER");
          });
          yield cancel(task);
        });
      });

      it("put({})", () => {
        runSaga(store, function* () {
          yield put({ type: null });
        });
        expect(store.getActions()).toEqual([{ type: null }]);
      });

      it('put({ type: "@@BROADCAST/THING" })', () => {
        runSaga(store, function* () {
          yield put({ type: "@@BROADCAST/THING" });
        });
        expect(store.getActions()).toEqual([{ type: "@@BROADCAST/THING" }]);
      });

      it('put({ type: "THING" })', () => {
        runSaga(store, function* () {
          yield put({ type: "THING" });
        });
        expect(store.getActions()).toEqual([{ type: "test_THING" }]);
      });

      it('take("*")', () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take());
          sniff.push(yield take("*"));
        });

        store.dispatch({ type: "probe-1" });
        store.dispatch({ type: "probe-2" });
        expect(sniff).toEqual([{ type: "probe-1" }, { type: "probe-2" }]);
      });

      it('take("REQUEST")', () => {
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take("REQUEST"));
        });

        store.dispatch({ type: "test_REQUEST" });
        expect(sniff).toEqual([{ type: "REQUEST" }]);
      });

      it('take(Symbol("REQUEST"))', () => {
        const symbol = Symbol("REQUEST");
        const sniff = [];
        runSaga(store, function* () {
          sniff.push(yield take(symbol));
        });

        store.dispatch({ type: symbol });
        expect(sniff).toEqual([{ type: symbol }]);
      });

      it('take(["REQUEST", Symbol("REQUEST")])', () => {
        const symbol = Symbol("REQUEST");
        const sniff = [];
        runSaga(store, function* () {
          while (true) {
            const action = yield take(["REQUEST", symbol]);
            sniff.push(action);
          }
        });

        store.dispatch({ type: "test_REQUEST" });
        store.dispatch({ type: symbol });
        expect(sniff).toEqual([{ type: "REQUEST" }, { type: symbol }]);
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
