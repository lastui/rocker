import React from "react";
import { Provider } from "react-redux";
import { ModuleContext } from "@lastui/rocker/platform";
import setupStore from "../store";

const ReduxProvider = (props) => {
	const [_, setErrorState] = React.useState();

	const [state, setState] = React.useState({
		store: undefined,
		moduleLoader: undefined,
		isReady: false,
	});

	const setupProviders = async () => {
		try {
			const [store, moduleLoader] = await setupStore();
			setState({
				store,
				moduleLoader,
				isReady: true,
			});
		} catch (error) {
			setErrorState(() => {
				throw error;
			});
		}
	};

	React.useEffect(() => {
		setupProviders();
	}, []);

	if (!state.isReady) {
		return null;
	}

	return (
		<ModuleContext.Provider value={state.moduleLoader}>
			<Provider store={state.store}>
				{props.children}
			</Provider>
		</ModuleContext.Provider>
	);
};

export default ReduxProvider;
