import React from "react";
import { useSelector } from "react-redux";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { Module, Router } from "@lastui/rocker/platform";
import { getEntrypoint, getLanguage, getI18nMessages } from "../selector";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const cache = createIntlCache();

const Entrypoint = (props) => {
	const entrypoint = useSelector(getEntrypoint);
	const locale = useSelector(getLanguage);
	const messages = useSelector(getI18nMessages);
	const intl = React.useMemo(
		() =>
			createIntl(
				{
					locale,
					textComponent: React.Fragment,
					messages,
					onError: (err) => {
						if (err.code !== "MISSING_TRANSLATION") {
							throw err;
						}
					},
				},
				cache
			),
		[locale, messages]
	);

	console.log('messages are now', messages, 'and language is', locale)

	if (entrypoint === null) {
		return null;
	}
	return (
		<RawIntlProvider value={intl}>
			<Router history={history}>
				<Module name={entrypoint} />
			</Router>
		</RawIntlProvider>
	);
};

export default Entrypoint;
