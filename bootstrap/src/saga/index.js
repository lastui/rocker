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

	do {
		try {
			const context = yield call(action.payload.fetchContext);
			yield put(actions.setAvailableModules(context.available));
			yield put(actions.setEntryPointModule(context.entrypoint));
		} catch (error) {
			console.warn("failed to obtain context", error);
		} finally {
			yield delay(interval);
		}
	} while (contextRefreshInterval > 0 && process.env.NODE_ENV !== "development");
}

export default [watchContext];
