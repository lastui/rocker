import React from "react";
import Provider from "./Provider";
import Entrypoint from "./Entrypoint";

const Main = (props) => (
	<Provider>
		<Entrypoint {...props} />
	</Provider>
);

export default Main;
