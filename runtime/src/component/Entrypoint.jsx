import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { Module, Switch, BrowserRouter } from "@lastui/rocker/platform";
import { getEntrypoint, getLanguage, getI18nMessages } from "../selector";

const Entrypoint = (props) => {
	const entrypoint = useSelector(getEntrypoint);
	const language = useSelector(getLanguage);
	const messages = useSelector(getI18nMessages);
	if (entrypoint === null) {
		return null;
	}
	return (
		<IntlProvider
			messages={messages}
			locale={language}
			onError={(err) => {
				if (err.code !== "MISSING_TRANSLATION") {
					throw err;
				}
			}}
		>
			<BrowserRouter>
				<Switch>
					<Module name={entrypoint} />
				</Switch>
			</BrowserRouter>
		</IntlProvider>
	);
};

export default Entrypoint;
