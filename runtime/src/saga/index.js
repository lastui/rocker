import { delay } from 'redux-saga';

import { call, put, takeLatest, select } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";

function* watchInit() {
	yield takeLatest(constants.INIT, runInit);
}

function* runInit(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}

	while (true) {
		try {
			const context = yield call(action.payload.fetchContext);
			yield put(actions.setAvailableModules(context.available));
			const lang = yield select((state) => state.runtime.language);
			yield put(actions.setLanguage(lang));
			yield put(actions.setEntryPointModule(context.entrypoint));
		} catch (err) {
			
		}
		yield call(delay, 5000);
	}
}

export default [watchInit];
