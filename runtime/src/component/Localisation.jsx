import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { getLanguage } from "../selector";

const Localisation = (props) => {
	const language = useSelector(getLanguage);

	return (
		<IntlProvider locale={language}>
			{props.children}
		</IntlProvider>
	);
};

export default Localisation;
