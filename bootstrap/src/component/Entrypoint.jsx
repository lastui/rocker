import { useMemo } from "react";
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
	const intl = useMemo(
		() =>
			createIntl(
				{
					locale,
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
	if (entrypoint === null) {
		return null;
	}
	return (
		<RawIntlProvider intl={intl}>
			<Router history={history}>
				<Module name={entrypoint} />
			</Router>
		</RawIntlProvider>
	);
};

export default Entrypoint;
