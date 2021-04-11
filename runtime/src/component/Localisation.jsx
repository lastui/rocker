import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { getLanguage, getI18nMessages } from "../selector";

const Localisation = (props) => {
	const language = useSelector(getLanguage);
	const messages = useSelector(getI18nMessages);

	return (
		<IntlProvider messages={messages} locale={language}>
			{props.children}
		</IntlProvider>
	);
};

export default Localisation;
