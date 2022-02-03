import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { actions } from "@lastui/rocker/platform";
import setupStore from "../store";
import Entrypoint from './Entrypoint'

const Main = (props) => {
	const [_, setErrorState] = React.useState(undefined);
	const [store, setStore] = React.useState(undefined);

	React.useEffect(async () => {
		try {
			const nextStore = await setupStore(props.reduxMiddlewares);
			nextStore.dispatch(actions.init(props.fetchContext, props.initializeRuntime));
			setStore(nextStore);
		} catch (error) {
			setErrorState(() => {
				throw error;
			});
		}
	}, []);

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
