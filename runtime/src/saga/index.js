import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";


function* watchInit() {
	yield takeLatest(constants.INIT, runInit);
}

function* runInit(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}
	const interval = 30 * 1000;
	do {
		try {
			const context = yield call(action.payload.fetchContext);
			yield put(actions.setAvailableModules(context.available));
			const lang = yield select((state) => state.runtime.language);
			yield put(actions.setLanguage(lang));
			yield put(actions.setEntryPointModule(context.entrypoint));
		} catch (err) {

		} finally {
			yield delay(interval);
		}
	} while (process.env.NODE_ENV !== "development")
}

export default [watchInit];
