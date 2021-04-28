import { Store, applyMiddleware, compose, createStore, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { runtimeReducer, sharedReducer } from "../reducer";
import sagas from "../saga";
import {
	createModuleLoader,
	moduleLoaderMiddleware,
} from "@lastui/rocker/platform";

export default async () => {
	const loader = createModuleLoader();
	const sagaMiddleware = createSagaMiddleware();

	const enhancers = [sagaMiddleware, moduleLoaderMiddleware(loader)];

	if (window.__GROOPIE_EXTENSION__) {
		enhancers.unshift(window.__GROOPIE_EXTENSION__);
	}
/*
	const composer = process.env.NODE_ENV === 'development'
		? require('redux-devtools-extension').composeWithDevTools
		: compose;
*/

	const composer = compose

	const reducer = combineReducers({
		runtime: runtimeReducer,
		shared: sharedReducer,
		modules: loader.getReducer(),
	});

	const store = createStore(
		reducer,
		{},
		composer(...[applyMiddleware(...enhancers)])
	);

	loader.setSagaRunner(sagaMiddleware.run);
	loader.setStore(store);

	sagaMiddleware.run(function* rooSaga() {
		yield all(sagas.map(fork));
	});

	return [store, loader];
};