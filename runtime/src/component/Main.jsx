import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { actions } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from './Entrypoint'

const Main = (props) => {
	const [_, setErrorState] = React.useState();

	const [state, setState] = React.useState({
		store: undefined,
		isReady: false,
	});

	React.useEffect(async () => {
		try {
			const store = await setupStore(props.reduxMiddlewares);
			store.dispatch(actions.init(props.fetchContext, props.initializeRuntime));
			setState({
				store,
				isReady: true,
			});
		} catch (error) {
			setErrorState(() => {	// FIXME maybe not needed
				throw error;
			});
		}
	}, []);

	if (!state.isReady) {
		return null;
	}

	return (
		<ReduxProvider store={state.store}>
			<Entrypoint />
		</ReduxProvider>
	);
};

export default Main;
