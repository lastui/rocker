import { useMemo, Fragment } from "react";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import { getLanguage, getI18nMessages } from "../selector";

const cache = createIntlCache();

const Globalisation = (props) => {
  const locale = useSelector(getLanguage);
  const messages = useSelector(getI18nMessages);

  const intl = useMemo(
    () =>
      createIntl(
        {
          locale,
          textComponent: Fragment,
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

  return <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>;
};

export default Globalisation;
