import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";

function* watchContext() {
	yield takeLatest(constants.INIT, runContextRefresher);
}

function* runContextRefresher(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}
	const interval = 5 * 1000;

	do {
		try {
			const context = yield call(action.payload.fetchContext);
			yield put(actions.setAvailableModules(context.available));
			yield put(actions.setEntryPointModule(context.entrypoint));
		} catch (err) {
			console.warn("failed to obtain context", err);
		} finally {
			yield delay(interval);
		}
	} while (process.env.NODE_ENV !== "development");
}

export default [watchContext];
