import { Store, applyMiddleware, compose, createStore, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { runtimeReducer, sharedReducer } from "../reducer";
import sagas from "../saga";
import {
	moduleLoader,
	moduleLoaderMiddleware,
	dynamicMiddleware,
} from "@lastui/rocker/platform";

export default async (middlewares) => {
	const sagaMiddleware = createSagaMiddleware();

	const enhancers = [
		moduleLoaderMiddleware(moduleLoader),
		sagaMiddleware,
		...(middlewares || []),
		dynamicMiddleware,
	];

	const composer = process.env.NODE_ENV === 'development'
		? require('redux-devtools-extension').composeWithDevTools
		: compose;

	const reducer = combineReducers({
		runtime: runtimeReducer,
		shared: sharedReducer,
		modules: moduleLoader.getReducer(),
	});

	const store = createStore(
		reducer,
		{},
		composer(...[applyMiddleware(...enhancers)])
	);

	moduleLoader.setSagaRunner(sagaMiddleware.run);
	moduleLoader.setStore(store);

	sagaMiddleware.run(function* rooSaga() {
		yield all(sagas.map(fork));
	});

	return store;
};