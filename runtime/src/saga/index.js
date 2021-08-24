import { call, put, takeLatest, select, delay } from "redux-saga/effects";
import { actions, constants } from "@lastui/rocker/platform";


function* watchInit() {
	yield takeLatest(constants.INIT, runInit);
}

function* runInit(action) {
	if (action.payload.initializeRuntime) {
		yield call(action.payload.initializeRuntime);
	}
	do {
		try {
			const context = yield call(action.payload.fetchContext);
			const currentEntrypoint = yield select((state) => state.runtime.entrypoint)
			const currentAvailable = yield select((state) => state.shared.available)
			const nextAvailable = context.available.map((item) => item.id)

			if (!(currentEntrypoint === context.entrypoint && currentAvailable.every(item => nextAvailable.indexOf(item) !== -1) && nextAvailable.every(item => currentAvailable.indexOf(item) !== -1))) {
				yield put(actions.setAvailableModules(context.available));
				const lang = yield select((state) => state.runtime.language);
				yield put(actions.setLanguage(lang));
				yield put(actions.setEntryPointModule(context.entrypoint));
			}
		} catch (err) {

		} finally {
			yield delay(15000);
		}
	} while (process.env.NODE_ENV !== "development")
}

export default [watchInit];
