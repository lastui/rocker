import { Store, applyMiddleware, compose, createStore, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { runtimeReducer } from "../reducer";
import { watchRefresh, watchFetchContext, watchBootstrap } from "../saga";
import {
	setSagaRunner,
	setStore,
	sharedReducer,
	modulesReducer,
	moduleLoaderMiddleware,
	dynamicMiddleware,
} from "@lastui/rocker/platform";

export default async (fetchContext, bootstrapMiddlewares) => {
	const sagaMiddleware = createSagaMiddleware({
		context: {
			fetchContext,
		},
	});

	const enhancers = [
		moduleLoaderMiddleware,
		sagaMiddleware,
		...(bootstrapMiddlewares || []),
		dynamicMiddleware,
	];

	const composer = process.env.NODE_ENV === 'development'
		? require('@redux-devtools/extension').composeWithDevTools
		: compose;

	const reducer = combineReducers({
		runtime: runtimeReducer,
		shared: sharedReducer,
		modules: modulesReducer,
	});

	const store = createStore(
		reducer,
		{},
		composer(...[applyMiddleware(...enhancers)])
	);

	setSagaRunner(sagaMiddleware.run);
	setStore(store);

	const sagas = [
		watchBootstrap,
		watchFetchContext,
		watchRefresh,
	];
	sagaMiddleware.run(function* rooSaga() {
		yield all(sagas.map(fork));
	});

	return store;
};