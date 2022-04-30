import React from "react";
import { useSelector } from "react-redux";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { getLanguage, getI18nMessages } from "../selector";

const cache = createIntlCache();

const Globalisation = (props) => {
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
            if (err.code !== "MISSING_TRANSLATION" && err.code !== "MISSING_DATA") {
              throw err;
            }
          },
        },
        cache,
      ),
    [locale, messages],
  );

  return (
    <RawIntlProvider value={intl}>
      {props.children}
    </RawIntlProvider>
  );
};

export default Globalisation;