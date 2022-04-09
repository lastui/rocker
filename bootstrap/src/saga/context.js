import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { constants } from "@lastui/rocker/platform";

export function* watchContext() {
	yield takeLatest(constants.INIT, runContextRefresher);
}

export function* runContextRefresher(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}
	const interval = Number(action.payload.contextRefreshInterval);
	const predicate = interval > 0 && process.env.NODE_ENV !== "development";
	if (predicate) {
		console.debug(`context will refresh automatically each ${interval} ms.`)
	}
	do {
		try {
			const context = yield call(action.payload.fetchContext);
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
		} finally {
			if (interval > 0) {
				yield delay(interval);
			}
		}
	} while (predicate);
}
