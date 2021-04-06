import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Switch } from "react-router";
import { history } from "@lastui/rocker/platform";
import ReduxProvider from "./ReduxProvider";
import Entrypoint from "./Entrypoint";

const Main = (props) => (
	<ReduxProvider>
		<ConnectedRouter history={history}>
			<Switch>
				<Entrypoint {...props} />
			</Switch>
		</ConnectedRouter>
	</ReduxProvider>
);

export default Main;
