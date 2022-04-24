import { call, put, takeLatest, getContext } from "redux-saga/effects";
import { constants } from "@lastui/rocker/platform";

export function* watchRefresh() {
  yield takeLatest(constants.REFRESH, refreshContext);
}

export function* refreshContext() {
  yield put({ type: constants.FETCH_CONTEXT });
}

export function* watchFetchContext() {
  yield takeLatest(constants.FETCH_CONTEXT, fetchContext);
}

export function* fetchContext() {
  try {
    const fetcher = yield getContext("fetchContext");
    const context = yield call(fetcher);
    yield put({
      type: constants.SET_AVAILABLE_MODULES,
      payload: {
        modules: context.available,
      },
    });
    yield put({
      type: constants.SET_ENTRYPOINT_MODULE,
      payload: {
        entrypoint: context.entrypoint,
      },
    });
  } catch (error) {
    console.warn("failed to obtain context", error);
  }
}
