import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { actions, ModuleContext } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from './Entrypoint'

const Main = (props) => {
	const [_, setErrorState] = React.useState();

	const [state, setState] = React.useState({
		store: undefined,
		moduleLoader: undefined,
		isReady: false,
	});

	React.useEffect(async () => {
		try {
			const [store, moduleLoader] = await setupStore();
			store.dispatch(actions.init(props.fetchContext, props.initializeRuntime));
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
	}, []);

	if (!state.isReady) {
		return null;
	}

	return (
		<ModuleContext.Provider value={state.moduleLoader}>
			<ReduxProvider store={state.store}>
				<Entrypoint />
			</ReduxProvider>
		</ModuleContext.Provider>
	);
};

export default Main;
