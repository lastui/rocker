import { call, put, takeLatest, take, race, delay } from "redux-saga/effects";

import { constants } from "@lastui/rocker/platform";

export function* watchBootstrap() {
  yield takeLatest(constants.INIT, runRefresher);
}

export function* runRefresher(action) {
  const interval = Number(action.payload.contextRefreshInterval);
  const predicate = interval > 0 && process.env.NODE_ENV !== "development";
  if (predicate) {
    console.debug(`context will refresh automatically each ${interval} ms.`);
  }
  do {
    yield put({ type: constants.FETCH_CONTEXT });
    let waiting = interval > 0;
    while (waiting) {
      const { refresh, timeout } = yield race({
        refresh: take(constants.REFRESH),
        timeout: delay(interval),
      });
      if (timeout) {
        waiting = false;
      } else {
        console.debug(`context manually refreshed, will refresh automatically after ${interval} ms.`);
      }
    }
  } while (predicate);
}
