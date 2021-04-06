import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, constants } from '@lastui/rocker/platform';
//import { getContext } from '../service';

function* watchInit() {
	yield takeLatest(constants.INIT, runInit);
}

function* runInit(action) {
	const context = yield call(action.payload.fetchContext);
	yield put(actions.setAvailableModules(context.available));
	yield put(actions.setEntryPointModule(context.entrypoint));
}

export default [
	watchInit,
];