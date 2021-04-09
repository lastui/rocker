import React from "react";
import { Switch } from "react-router";
import Provider from "./Provider";
import Entrypoint from "./Entrypoint";

const Main = (props) => (
	<Provider>
		<Switch>
			<Entrypoint {...props} />
		</Switch>
	</Provider>
);

export default Main;
