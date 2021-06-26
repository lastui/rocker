import { call, put, takeLatest, select } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";

function* watchInit() {
	yield takeLatest(constants.INIT, runInit);
}

function* runInit(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}
	const context = yield call(action.payload.fetchContext);
	yield put(actions.setAvailableModules(context.available));
	const lang = yield select((state) => state.runtime.language);
	yield put(actions.setLanguage(lang));
	yield put(actions.setEntryPointModule(context.entrypoint));
}

export default [watchInit];