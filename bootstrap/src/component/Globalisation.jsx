import { useMemo, Fragment } from "react";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import { getLanguage, getI18nMessagesFacade } from "../selector";

const cache = createIntlCache();

const Globalisation = (props) => {
  const getI18nMessages = useMemo(() => getI18nMessagesFacade(props.defaultLocale), [props.defaultLocale]);

  const locale = useSelector(getLanguage);
  const messages = useSelector(getI18nMessages);

  const intl = useMemo(
    () =>
      createIntl(
        {
          locale,
          defaultLocale: props.defaultLocale,
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
    [props.defaultLocale, locale, messages],
  );

  return <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>;
};

export default Globalisation;
