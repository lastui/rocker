import { Store, applyMiddleware, compose, createStore } from "redux";
//import { connectRouter, routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { runtimeReducer, sharedReducer } from "../reducer";
import sagas from "../saga";
import {
	history,
	createModuleLoader,
	moduleLoaderMiddleware,
} from "@lastui/rocker/platform";

export default async () => {
	const loader = createModuleLoader();
	const sagaMiddleware = createSagaMiddleware();

	const enhancers = [
		sagaMiddleware,
		//routerMiddleware(history),
		moduleLoaderMiddleware(loader),
	];

	if (window.__GROOPIE_EXTENSION__) {
		enhancers.unshift(window.__GROOPIE_EXTENSION__);
	}

	const reducer = combineReducers({
		runtime: runtimeReducer,
		shared: sharedReducer,
		//router: connectRouter(history),
		modules: loader.getReducer(),
	});

	const store = createStore(
		reducer,
		{},
		compose(...[applyMiddleware(...enhancers)])
	);

	loader.setSagaRunner(sagaMiddleware.run);
	loader.setStore(store);

	sagaMiddleware.run(function* rooSaga() {
		yield all(sagas.map(fork));
	});

	return [store, loader];
};
