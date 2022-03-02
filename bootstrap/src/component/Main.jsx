import { useState, useCallback, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { actions } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from "./Entrypoint";

const Main = (props) => {
	const [_, setErrorState] = useState();
	const [store, setStore] = useState();

	const bootstrap = useCallback(async () => {
		console.debug("bootstraping runtime");
		try {
			const nextStore = await setupStore(props.reduxMiddlewares);
			nextStore.dispatch(
				actions.init(props.fetchContext, props.initializeRuntime)
			);
			setStore(nextStore);
		} catch (error) {
			setErrorState(() => {
				throw error;
			});
		}
	}, [props.reduxMiddlewares, props.fetchContext, props.initializeRuntime]);

	useEffect(() => {
		bootstrap();
	}, [bootstrap]);

	if (!store) {
		return null;
	}

	return (
		<ReduxProvider store={store}>
			<Entrypoint />
		</ReduxProvider>
	);
};

export default Main;
