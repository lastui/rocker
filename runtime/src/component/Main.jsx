import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Switch, Route } from "react-router";
import { history } from "@lastui/rocker/platform";
import ReduxProvider from "./ReduxProvider";
import Entrypoint from "./Entrypoint";

const Main = () => (
	<ReduxProvider>
		<ConnectedRouter history={history}>
			<Switch>
				<Route component={Entrypoint} />
			</Switch>
		</ConnectedRouter>
	</ReduxProvider>
);

export default Main;
