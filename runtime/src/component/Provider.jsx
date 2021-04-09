import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { IntlProvider } from "react-intl";
import { ModuleContext, history } from "@lastui/rocker/platform";
import { ConnectedRouter } from "connected-react-router";
import setupStore from "../store";
import Localisation from "./Localisation";

const Provider = (props) => {
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
			<ReduxProvider store={state.store}>
				<Localisation>
					<ConnectedRouter history={history}>
						{props.children}
					</ConnectedRouter>
				</Localisation>
			</ReduxProvider>
		</ModuleContext.Provider>
	);
};

export default Provider;
