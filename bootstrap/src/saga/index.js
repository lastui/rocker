import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";

function* watchContext() {
	yield takeLatest(constants.INIT, runContextRefresher);
}

function* runContextRefresher(action) {
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
			yield put(actions.setAvailableModules(context.available));
			yield put(actions.setEntryPointModule(context.entrypoint));
		} catch (error) {
			console.warn("failed to obtain context", error);
		} finally {
			if (interval > 0) {
				yield delay(interval);
			}
		}
	} while (predicate);
}

export default [watchContext];
