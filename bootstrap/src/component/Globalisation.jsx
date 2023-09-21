import { useMemo, useEffect, Fragment } from "react";
import { createIntl, createIntlCache, RawIntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import { getLanguage, getI18nMessages } from "../selector";

const cache = createIntlCache();

// TODO improve
const fallbackMessages = (defaultLocale, locale, messages) =>
  new Proxy(
    {
      descriptor: {
        configurable: true,
        enumerable: true,
      },
    },
    {
      getOwnPropertyDescriptor(ref, key) {
        return ref.descriptor;
      },
      get(ref, key) {
        const messagesExpected = Reflect.get(messages, locale);
        if (messagesExpected) {
          const valueExpected = Reflect.get(messagesExpected, key);
          if (valueExpected) {
            return valueExpected;
          }
        }
        const messagesFallback = Reflect.get(messages, defaultLocale);
        if (messagesFallback) {
          const valueFallback = Reflect.get(messagesFallback, key);
          if (valueFallback) {
            return valueFallback;
          }
        }
        return undefined;
      },
      set(ref, prop, value) {
        return false;
      },
    },
  );

const Globalisation = (props) => {
  const locale = useSelector(getLanguage);
  const messages = useSelector(getI18nMessages);

  const intl = useMemo(
    () =>
      createIntl(
        {
          locale,
          textComponent: Fragment,
          messages: fallbackMessages(props.defaultLocale, locale, messages),
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
