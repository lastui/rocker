import { put, takeLatest, take, race, delay } from "redux-saga/effects";

import { constants } from "@lastui/rocker/platform";

export function* watchBootstrap() {
  yield takeLatest(constants.INIT, runRefresher);
}

export function* runRefresher(action) {
  const interval = isNaN(action.payload.contextRefreshInterval) ? 0 : Number(action.payload.contextRefreshInterval);
  const predicate = interval > 0 && process.env.NODE_ENV !== "development";
  do {
    yield put({ type: constants.FETCH_CONTEXT });
    let waiting = interval > 0;
    while (waiting) {
      const { _refresh, timeout } = yield race({
        refresh: take(constants.REFRESH),
        timeout: delay(interval),
      });
      if (timeout) {
        waiting = false;
      }
    }
  } while (predicate);
}
